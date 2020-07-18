"use strict";
/*
 * Copyright (c) 2008-2020, Hazelcast, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var events_1 = require("events");
var HazelcastError_1 = require("../HazelcastError");
var ClientConnection_1 = require("./ClientConnection");
var net = require("net");
var tls = require("tls");
var Util_1 = require("../Util");
var BasicSSLOptionsFactory_1 = require("../connection/BasicSSLOptionsFactory");
var HeartbeatManager_1 = require("../HeartbeatManager");
var UuidUtil_1 = require("../util/UuidUtil");
var WaitStrategy_1 = require("./WaitStrategy");
var ConnectionStrategyConfig_1 = require("../config/ConnectionStrategyConfig");
var LifecycleService_1 = require("../LifecycleService");
var BuildInfo_1 = require("../BuildInfo");
var ClientAuthenticationCustomCodec_1 = require("../codec/ClientAuthenticationCustomCodec");
var ClientAuthenticationCodec_1 = require("../codec/ClientAuthenticationCodec");
var AuthenticationStatus_1 = require("../protocol/AuthenticationStatus");
var InvocationService_1 = require("../invocation/InvocationService");
var CONNECTION_REMOVED_EVENT_NAME = 'connectionRemoved';
var CONNECTION_ADDED_EVENT_NAME = 'connectionAdded';
var CLIENT_TYPE = 'NJS';
var SERIALIZATION_VERSION = 1;
var SET_TIMEOUT_MAX_DELAY = 2147483647;
var BINARY_PROTOCOL_VERSION = Buffer.from('CP2');
var ClientState;
(function (ClientState) {
    /**
     * Clients start with this state. Once a client connects to a cluster,
     * it directly switches to {@link #INITIALIZED_ON_CLUSTER} instead of
     * {@link #CONNECTED_TO_CLUSTER} because on startup a client has no
     * local state to send to the cluster.
     */
    ClientState[ClientState["INITIAL"] = 0] = "INITIAL";
    /**
     * When a client switches to a new cluster, it moves to this state.
     * It means that the client has connected to a new cluster but not sent
     * its local state to the new cluster yet.
     */
    ClientState[ClientState["CONNECTED_TO_CLUSTER"] = 1] = "CONNECTED_TO_CLUSTER";
    /**
     * When a client sends its local state to the cluster it has connected,
     * it switches to this state. When a client loses all connections to
     * the current cluster and connects to a new cluster, its state goes
     * back to {@link #CONNECTED_TO_CLUSTER}.
     * <p>
     * Invocations are allowed in this state.
     */
    ClientState[ClientState["INITIALIZED_ON_CLUSTER"] = 2] = "INITIALIZED_ON_CLUSTER";
})(ClientState || (ClientState = {}));
/**
 * Maintains connections between the client and members of the cluster.
 */
var ClientConnectionManager = /** @class */ (function (_super) {
    __extends(ClientConnectionManager, _super);
    function ClientConnectionManager(client) {
        var _this = _super.call(this) || this;
        _this.connectionIdCounter = 0;
        _this.alive = false;
        _this.clientUuid = UuidUtil_1.UuidUtil.generate(false);
        _this.activeConnections = new Map();
        _this.pendingConnections = new Map();
        _this.clientState = ClientState.INITIAL;
        _this.connectingAddresses = new Set();
        _this.client = client;
        _this.loadBalancer = client.getLoadBalancer();
        _this.labels = Array.from(client.getConfig().labels);
        _this.logger = _this.client.getLoggingService().getLogger();
        _this.connectionTimeoutMillis = _this.initConnectionTimeoutMillis();
        _this.heartbeatManager = new HeartbeatManager_1.HeartbeatManager(client, _this);
        _this.authenticationTimeout = _this.heartbeatManager.getHeartbeatTimeout();
        _this.shuffleMemberList = client.getConfig().properties['hazelcast.client.shuffle.member.list'];
        _this.isSmartRoutingEnabled = client.getConfig().networkConfig.smartRouting;
        _this.waitStrategy = _this.initWaitStrategy(client.getConfig());
        var connectionStrategyConfig = client.getConfig().connectionStrategyConfig;
        _this.asyncStart = connectionStrategyConfig.asyncStart;
        _this.reconnectMode = connectionStrategyConfig.reconnectMode;
        return _this;
    }
    ClientConnectionManager.prototype.start = function () {
        var _this = this;
        if (this.alive) {
            return Promise.resolve();
        }
        this.alive = true;
        this.heartbeatManager.start();
        return this.connectToCluster()
            .then(function () {
            if (_this.isSmartRoutingEnabled) {
                _this.reconnectToMembersTask = Util_1.scheduleWithRepetition(_this.reconnectToMembers.bind(_this), 1000, 1000);
            }
        });
    };
    ClientConnectionManager.prototype.connectToAllClusterMembers = function () {
        if (!this.isSmartRoutingEnabled) {
            return Promise.resolve();
        }
        var members = this.client.getClusterService().getMembers();
        return this.tryConnectToAllClusterMembers(members);
    };
    ClientConnectionManager.prototype.shutdown = function () {
        if (!this.alive) {
            return;
        }
        this.alive = false;
        if (this.isSmartRoutingEnabled) {
            Util_1.cancelRepetitionTask(this.reconnectToMembersTask);
        }
        this.pendingConnections.forEach(function (pending) {
            pending.reject(new HazelcastError_1.ClientNotActiveError('Hazelcast client is shutting down'));
        });
        this.activeConnections.forEach(function (connection) {
            connection.close('Hazelcast client is shutting down', null);
        });
        this.removeAllListeners(CONNECTION_REMOVED_EVENT_NAME);
        this.removeAllListeners(CONNECTION_ADDED_EVENT_NAME);
        this.heartbeatManager.shutdown();
    };
    ClientConnectionManager.prototype.getConnection = function (uuid) {
        return this.activeConnections.get(uuid.toString());
    };
    ClientConnectionManager.prototype.checkIfInvocationAllowed = function () {
        var state = this.clientState;
        if (state === ClientState.INITIALIZED_ON_CLUSTER && this.activeConnections.size > 0) {
            return null;
        }
        var error;
        if (state === ClientState.INITIAL) {
            if (this.asyncStart) {
                error = new HazelcastError_1.ClientOfflineError();
            }
            else {
                error = new HazelcastError_1.IOError('No connection found to cluster since the client is starting.');
            }
        }
        else if (this.reconnectMode === ConnectionStrategyConfig_1.ReconnectMode.ASYNC) {
            error = new HazelcastError_1.ClientOfflineError();
        }
        else {
            error = new HazelcastError_1.IOError('No connection found to cluster.');
        }
        return error;
    };
    ClientConnectionManager.prototype.getActiveConnections = function () {
        return Array.from(this.activeConnections.values());
    };
    ClientConnectionManager.prototype.isAlive = function () {
        return this.alive;
    };
    ClientConnectionManager.prototype.getClientUuid = function () {
        return this.clientUuid;
    };
    ClientConnectionManager.prototype.getOrConnect = function (address) {
        var _this = this;
        if (!this.client.getLifecycleService().isRunning()) {
            return Promise.reject(new HazelcastError_1.ClientNotActiveError('Client is not active.'));
        }
        var connection = this.getConnectionFromAddress(address);
        if (connection) {
            return Promise.resolve(connection);
        }
        var addressKey = address.toString();
        var pendingConnection = this.pendingConnections.get(addressKey);
        if (pendingConnection) {
            return pendingConnection.promise;
        }
        var connectionResolver = Util_1.DeferredPromise();
        this.pendingConnections.set(addressKey, connectionResolver);
        var processResponseCallback = function (msg) {
            _this.client.getInvocationService().processResponse(msg);
        };
        var translatedAddress;
        var clientConnection;
        this.translate(address)
            .then(function (translated) {
            translatedAddress = translated;
            if (translatedAddress == null) {
                throw new RangeError("Address Translator could not translate address " + address);
            }
            return _this.triggerConnect(translatedAddress);
        })
            .then(function (socket) {
            clientConnection = new ClientConnection_1.ClientConnection(_this.client, translatedAddress, socket, _this.connectionIdCounter++);
            return _this.initiateCommunication(socket);
        })
            .then(function () { return clientConnection.registerResponseCallback(processResponseCallback); })
            .then(function () { return _this.authenticateOnCluster(clientConnection); })
            .then(function () { return connectionResolver.resolve(clientConnection); })
            .catch(function (error) { return connectionResolver.reject(error); });
        return connectionResolver.promise
            .timeout(this.connectionTimeoutMillis, new HazelcastError_1.HazelcastError("Connection timed out to address " + address + "."))
            .finally(function () { return _this.pendingConnections.delete(addressKey); });
    };
    ClientConnectionManager.prototype.getRandomConnection = function () {
        if (this.isSmartRoutingEnabled) {
            var member = this.loadBalancer.next();
            if (member != null) {
                var connection = this.getConnection(member.uuid);
                if (connection != null) {
                    return connection;
                }
            }
        }
        var iterator = this.activeConnections.values();
        var next = iterator.next();
        if (!next.done) {
            return next.value;
        }
        else {
            return null;
        }
    };
    ClientConnectionManager.prototype.onConnectionClose = function (connection) {
        var endpoint = connection.getRemoteAddress();
        var memberUuid = connection.getRemoteUuid();
        if (endpoint == null) {
            this.logger.trace('ConnectionManager', 'Destroying ' + connection +
                ', but it has endpoint set to null -> not removing it from a connection map');
            return;
        }
        if (memberUuid != null && this.activeConnections.delete(memberUuid.toString())) {
            this.logger.info('ConnectionManager', 'Removed connection to endpoint: ' +
                endpoint + ':' + memberUuid + ', connection: ' + connection);
            if (this.activeConnections.size === 0) {
                if (this.clientState === ClientState.INITIALIZED_ON_CLUSTER) {
                    this.emitLifecycleEvent(LifecycleService_1.LifecycleState.DISCONNECTED);
                }
                this.triggerClusterReconnection();
            }
            this.emitConnectionRemovedEvent(connection);
        }
        else {
            this.logger.trace('ConnectionManager', 'Destroying a connection, but there is no mapping ' +
                endpoint + ':' + memberUuid + '->' + connection + ' in the connection map.)');
        }
    };
    ClientConnectionManager.prototype.initWaitStrategy = function (config) {
        var connectionStrategyConfig = config.connectionStrategyConfig;
        var retryConfig = connectionStrategyConfig.connectionRetryConfig;
        return new WaitStrategy_1.WaitStrategy(retryConfig.initialBackoffMillis, retryConfig.maxBackoffMillis, retryConfig.multiplier, retryConfig.clusterConnectTimeoutMillis, retryConfig.jitter, this.logger);
    };
    ClientConnectionManager.prototype.initConnectionTimeoutMillis = function () {
        var networkConfig = this.client.getConfig().networkConfig;
        var connTimeout = networkConfig.connectionTimeout;
        return connTimeout === 0 ? SET_TIMEOUT_MAX_DELAY : connTimeout;
    };
    ClientConnectionManager.prototype.connectToCluster = function () {
        if (this.asyncStart) {
            return this.submitConnectToClusterTask();
        }
        else {
            return this.doConnectToCluster();
        }
    };
    ClientConnectionManager.prototype.submitConnectToClusterTask = function () {
        var _this = this;
        if (this.connectToClusterTaskSubmitted) {
            return Promise.resolve();
        }
        this.doConnectToCluster()
            .then(function () {
            _this.connectToClusterTaskSubmitted = false;
            if (_this.activeConnections.size === 0) {
                _this.logger.warn('ConnectionManager', 'No connection to cluster ' + _this.clusterId);
                return _this.submitConnectToClusterTask();
            }
        })
            .catch(function (error) {
            _this.logger.warn('ConnectionManager', 'Could not connect to any cluster, shutting down ' +
                'the client: ' + error.message);
            _this.shutdownClient();
        });
        this.connectToClusterTaskSubmitted = true;
        return Promise.resolve();
    };
    ClientConnectionManager.prototype.doConnectToCluster = function () {
        var _this = this;
        var triedAddresses = new Set();
        this.waitStrategy.reset();
        return this.tryConnectingToAddresses(triedAddresses)
            .then(function (isConnected) {
            if (isConnected) {
                return;
            }
            _this.logger.info('ConnectionManager', 'Unable to connect any address from the cluster ' +
                'with the name: ' + _this.client.getConfig().clusterName +
                '. The following addresses were tried: ' +
                Array.from(triedAddresses));
            var message = _this.client.getLifecycleService().isRunning()
                ? 'Unable to connect any cluster.' : 'Client is being shutdown.';
            throw new HazelcastError_1.IllegalStateError(message);
        });
    };
    ClientConnectionManager.prototype.tryConnectingToAddresses = function (triedAddresses) {
        var _this = this;
        return this.getPossibleMemberAddresses()
            .then(function (addresses) {
            return _this.tryConnectingToAddress(0, addresses, triedAddresses);
        })
            .then(function (isConnected) {
            if (isConnected) {
                return true;
            }
            // If the address providers load no addresses (which seems to be possible),
            // then the above loop is not entered and the lifecycle check is missing,
            // hence we need to repeat the same check at this point.
            if (!_this.client.getLifecycleService().isRunning()) {
                return Promise.reject(new HazelcastError_1.ClientNotActiveError('Client is not active.'));
            }
            return _this.waitStrategy.sleep()
                .then(function (notTimedOut) {
                if (notTimedOut) {
                    return _this.tryConnectingToAddresses(triedAddresses);
                }
                return false;
            });
        })
            .catch(HazelcastError_1.ClientNotAllowedInClusterError, HazelcastError_1.InvalidConfigurationError, function (error) {
            _this.logger.warn('ConnectionManager', 'Stopped trying on the cluster: ' +
                _this.client.getConfig().clusterName + ' reason: ' + error.message);
            return false;
        });
    };
    ClientConnectionManager.prototype.tryConnectingToAddress = function (index, addresses, triedAddresses) {
        var _this = this;
        if (index >= addresses.length) {
            return Promise.resolve(false);
        }
        var address = addresses[index];
        if (!this.client.getLifecycleService().isRunning()) {
            return Promise.reject(new HazelcastError_1.ClientNotActiveError('Client is not active.'));
        }
        triedAddresses.add(address.toString());
        return this.connect(address)
            .then(function (connection) {
            if (connection != null) {
                return true;
            }
            return _this.tryConnectingToAddress(index + 1, addresses, triedAddresses);
        });
    };
    ClientConnectionManager.prototype.connect = function (address) {
        var _this = this;
        this.logger.info('ConnectionManager', 'Trying to connect to ' + address);
        return this.getOrConnect(address)
            .catch(function (error) {
            _this.logger.warn('ConnectionManager', 'Error during initial connection to ' + address + ' ' +
                error);
            return null;
        });
    };
    ClientConnectionManager.prototype.emitLifecycleEvent = function (state) {
        this.client.getLifecycleService().emitLifecycleEvent(state);
    };
    ClientConnectionManager.prototype.getPossibleMemberAddresses = function () {
        var _this = this;
        var addresses = this.client.getClusterService().getMembers()
            .map((function (member) { return member.address.toString(); }));
        if (this.shuffleMemberList) {
            Util_1.shuffleArray(addresses);
        }
        var addressProvider = this.client.getAddressProvider();
        return addressProvider.loadAddresses()
            .catch(function (error) {
            _this.logger.warn('ConnectionManager', 'Error from AddressProvider ' + addressProvider +
                ', error: ' + error.message);
            return new Array();
        })
            .then(function (providerAddresses) {
            if (_this.shuffleMemberList) {
                Util_1.shuffleArray(providerAddresses);
            }
            var allAddresses = Array.from(new Set(addresses.concat(providerAddresses)));
            var result = [];
            for (var _i = 0, allAddresses_1 = allAddresses; _i < allAddresses_1.length; _i++) {
                var address = allAddresses_1[_i];
                result.push.apply(result, Util_1.AddressHelper.getSocketAddresses(address));
            }
            return result;
        });
    };
    ClientConnectionManager.prototype.getConnectionFromAddress = function (address) {
        for (var _i = 0, _a = this.getActiveConnections(); _i < _a.length; _i++) {
            var connection = _a[_i];
            if (connection.getRemoteAddress().equals(address)) {
                return connection;
            }
        }
        return null;
    };
    ClientConnectionManager.prototype.initiateCommunication = function (socket) {
        // Send the protocol version
        var deferred = Util_1.DeferredPromise();
        socket.write(BINARY_PROTOCOL_VERSION, function (err) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve();
        });
        return deferred.promise;
    };
    ClientConnectionManager.prototype.triggerConnect = function (translatedAddress) {
        var _this = this;
        if (this.client.getConfig().networkConfig.sslConfig.enabled) {
            if (this.client.getConfig().networkConfig.sslConfig.sslOptions) {
                var opts = this.client.getConfig().networkConfig.sslConfig.sslOptions;
                return this.connectTLSSocket(translatedAddress, opts);
            }
            else if (this.client.getConfig().networkConfig.sslConfig.sslOptionsFactoryConfig) {
                var factoryConfig = this.client.getConfig().networkConfig.sslConfig.sslOptionsFactoryConfig;
                var factoryProperties = this.client.getConfig().networkConfig.sslConfig.sslOptionsFactoryProperties;
                var factory_1;
                if (factoryConfig.path) {
                    factory_1 = new (Util_1.loadNameFromPath(factoryConfig.path, factoryConfig.exportedName))();
                }
                else {
                    factory_1 = new BasicSSLOptionsFactory_1.BasicSSLOptionsFactory();
                }
                return factory_1.init(factoryProperties).then(function () {
                    return _this.connectTLSSocket(translatedAddress, factory_1.getSSLOptions());
                });
            }
            else {
                // the default behavior when ssl is enabled
                var opts = this.client.getConfig().networkConfig.sslConfig.sslOptions = {
                    checkServerIdentity: function () { return null; },
                    rejectUnauthorized: true,
                };
                return this.connectTLSSocket(translatedAddress, opts);
            }
        }
        else {
            return this.connectNetSocket(translatedAddress);
        }
    };
    ClientConnectionManager.prototype.connectTLSSocket = function (address, configOpts) {
        var _this = this;
        var connectionResolver = Util_1.DeferredPromise();
        var socket = tls.connect(address.port, address.host, configOpts);
        socket.once('secureConnect', function () {
            connectionResolver.resolve(socket);
        });
        socket.on('error', function (e) {
            _this.logger.warn('ConnectionManager', 'Could not connect to address ' + address.toString(), e);
            connectionResolver.reject(e);
            if (e.code === 'EPIPE' || e.code === 'ECONNRESET') {
                var connection = _this.getConnectionFromAddress(address);
                if (connection != null) {
                    _this.onConnectionClose(connection);
                }
            }
        });
        return connectionResolver.promise;
    };
    ClientConnectionManager.prototype.connectNetSocket = function (address) {
        var _this = this;
        var connectionResolver = Util_1.DeferredPromise();
        var socket = net.connect(address.port, address.host);
        socket.once('connect', function () {
            connectionResolver.resolve(socket);
        });
        socket.on('error', function (e) {
            _this.logger.warn('ConnectionManager', 'Could not connect to address ' + address.toString(), e);
            connectionResolver.reject(e);
            if (e.code === 'EPIPE' || e.code === 'ECONNRESET') {
                var connection = _this.getConnectionFromAddress(address);
                if (connection != null) {
                    _this.onConnectionClose(connection);
                }
            }
        });
        return connectionResolver.promise;
    };
    ClientConnectionManager.prototype.emitConnectionAddedEvent = function (connection) {
        this.emit(CONNECTION_ADDED_EVENT_NAME, connection);
    };
    ClientConnectionManager.prototype.emitConnectionRemovedEvent = function (connection) {
        this.emit(CONNECTION_REMOVED_EVENT_NAME, connection);
    };
    ClientConnectionManager.prototype.translate = function (target) {
        var _this = this;
        var addressProvider = this.client.getAddressProvider();
        return addressProvider.translate(target)
            .catch(function (error) {
            _this.logger.warn('ConnectionManager', 'Failed to translate address ' + target +
                ' via address provider ' + error.message);
            return Promise.reject(error);
        });
    };
    ClientConnectionManager.prototype.triggerClusterReconnection = function () {
        if (this.reconnectMode === ConnectionStrategyConfig_1.ReconnectMode.OFF) {
            this.logger.info('ConnectionManager', 'RECONNECT MODE is off. Shutting down the client.');
            this.shutdownClient();
            return;
        }
        if (this.client.getLifecycleService().isRunning()) {
            this.submitConnectToClusterTask();
        }
    };
    ClientConnectionManager.prototype.shutdownClient = function () {
        try {
            this.client.getLifecycleService().shutdown();
        }
        catch (e) {
            this.logger.error('ConnectionManager', "Error during client shutdown " + e);
        }
    };
    // This method makes sure that the smart client has connection to all cluster members.
    // This is called periodically.
    ClientConnectionManager.prototype.reconnectToMembers = function () {
        var _this = this;
        if (!this.client.getLifecycleService().isRunning()) {
            return;
        }
        var _loop_1 = function (member) {
            var address = member.address;
            if (this_1.getConnectionFromAddress(address) == null) {
                if (this_1.connectingAddresses.has(address)) {
                    return "continue";
                }
                if (this_1.getConnection(member.uuid) == null) {
                    this_1.connectingAddresses.add(address);
                    this_1.getOrConnect(address)
                        .catch(function () {
                        // no-op
                    })
                        .finally(function () {
                        _this.connectingAddresses.delete(address);
                    });
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.client.getClusterService().getMembers(); _i < _a.length; _i++) {
            var member = _a[_i];
            _loop_1(member);
        }
    };
    ClientConnectionManager.prototype.authenticateOnCluster = function (connection) {
        var _this = this;
        var request = this.encodeAuthenticationRequest();
        var invocation = new InvocationService_1.Invocation(this.client, request);
        invocation.connection = connection;
        return this.client.getInvocationService()
            .invokeUrgent(invocation)
            .timeout(this.authenticationTimeout)
            .catch(function (e) {
            connection.close('Failed to authenticate connection', e);
            throw e;
        })
            .then(function (responseMessage) {
            var response = ClientAuthenticationCodec_1.ClientAuthenticationCodec.decodeResponse(responseMessage);
            if (response.status === AuthenticationStatus_1.AuthenticationStatus.AUTHENTICATED) {
                _this.handleSuccessfulAuth(connection, response);
            }
            else {
                var error = void 0;
                switch (response.status) {
                    case AuthenticationStatus_1.AuthenticationStatus.CREDENTIALS_FAILED:
                        error = new HazelcastError_1.AuthenticationError('Authentication failed. The configured cluster name on ' +
                            'the client does not match the one configured in the cluster or ' +
                            'the credentials set in the client security config could not be authenticated');
                        break;
                    case AuthenticationStatus_1.AuthenticationStatus.SERIALIZATION_VERSION_MISMATCH:
                        error = new HazelcastError_1.IllegalStateError('Server serialization version ' +
                            'does not match to client.');
                        break;
                    case AuthenticationStatus_1.AuthenticationStatus.NOT_ALLOWED_IN_CLUSTER:
                        error = new HazelcastError_1.ClientNotAllowedInClusterError('Client is not allowed in the cluster');
                        break;
                    default:
                        error = new HazelcastError_1.AuthenticationError('Authentication status code not supported. Status: ' +
                            response.status);
                }
                connection.close('Failed to authenticate connection', error);
                return Promise.reject(error);
            }
        });
    };
    ClientConnectionManager.prototype.handleSuccessfulAuth = function (connection, response) {
        this.checkPartitionCount(response.partitionCount);
        connection.setConnectedServerVersion(response.serverHazelcastVersion);
        connection.setRemoteAddress(response.address);
        connection.setRemoteUuid(response.memberUuid);
        var newClusterId = response.clusterId;
        var initialConnection = this.activeConnections.size === 0;
        var changedCluster = initialConnection && this.clusterId != null && !newClusterId.equals(this.clusterId);
        if (changedCluster) {
            this.logger.warn('ConnectionManager', 'Switching from current cluster: ' + this.clusterId +
                ' to new cluster: ' + newClusterId);
            this.client.onClusterRestart();
        }
        this.activeConnections.set(response.memberUuid.toString(), connection);
        if (initialConnection) {
            this.clusterId = newClusterId;
            if (changedCluster) {
                this.clientState = ClientState.CONNECTED_TO_CLUSTER;
                this.initializeClientOnCluster(newClusterId);
            }
            else {
                this.clientState = ClientState.INITIALIZED_ON_CLUSTER;
                this.emitLifecycleEvent(LifecycleService_1.LifecycleState.CONNECTED);
            }
        }
        this.logger.info('ConnectionManager', 'Authenticated with server ' +
            response.address + ':' + response.memberUuid + ', server version: ' + response.serverHazelcastVersion +
            ', local address: ' + connection.getLocalAddress());
        this.emitConnectionAddedEvent(connection);
        // It could happen that this connection is already closed and
        // onConnectionClose() is called even before the block
        // above is executed. In this case, now we have a closed but registered
        // connection. We do a final check here to remove this connection
        // if needed.
        if (!connection.isAlive()) {
            this.onConnectionClose(connection);
        }
    };
    ClientConnectionManager.prototype.encodeAuthenticationRequest = function () {
        var clusterName = this.client.getConfig().clusterName;
        var clientVersion = BuildInfo_1.BuildInfo.getClientVersion();
        var customCredentials = this.client.getConfig().customCredentials;
        var clientName = this.client.getName();
        var clientMessage;
        if (customCredentials != null) {
            var credentialsPayload = this.client.getSerializationService().toData(customCredentials).toBuffer();
            clientMessage = ClientAuthenticationCustomCodec_1.ClientAuthenticationCustomCodec.encodeRequest(clusterName, credentialsPayload, this.clientUuid, CLIENT_TYPE, SERIALIZATION_VERSION, clientVersion, clientName, this.labels);
        }
        else {
            clientMessage = ClientAuthenticationCodec_1.ClientAuthenticationCodec.encodeRequest(clusterName, null, null, this.clientUuid, CLIENT_TYPE, SERIALIZATION_VERSION, clientVersion, clientName, this.labels);
        }
        return clientMessage;
    };
    ClientConnectionManager.prototype.checkPartitionCount = function (newPartitionCount) {
        var partitionService = this.client.getPartitionService();
        if (!partitionService.checkAndSetPartitionCount(newPartitionCount)) {
            throw new HazelcastError_1.ClientNotAllowedInClusterError('Client can not work with this cluster because it has a different ' +
                'partition count. Expected partition count: ' + partitionService.getPartitionCount() +
                ', member partition count: ' + newPartitionCount);
        }
    };
    ClientConnectionManager.prototype.initializeClientOnCluster = function (targetClusterId) {
        var _this = this;
        if (!targetClusterId.equals(this.clusterId)) {
            this.logger.warn('ConnectionManager', 'Won\'t send client state to cluster: ' + targetClusterId +
                ' because switched to a new cluster: ' + this.clusterId);
            return;
        }
        return this.client.sendStateToCluster()
            .then(function () {
            if (targetClusterId.equals(_this.clusterId)) {
                _this.logger.trace('ConnectionManager', 'Client state is sent to cluster: ' +
                    targetClusterId);
                _this.clientState = ClientState.INITIALIZED_ON_CLUSTER;
                _this.emitLifecycleEvent(LifecycleService_1.LifecycleState.CONNECTED);
            }
            else {
                _this.logger.warn('ConnectionManager', 'Cannot set client state to initialized on ' +
                    'cluster because current cluster id: ' + _this.clusterId + ' is different than expected cluster id: ' +
                    targetClusterId);
            }
        })
            .catch(function (error) {
            var clusterName = _this.client.getConfig().clusterName;
            _this.logger.warn('ConnectionManager', 'Failure during sending state to the cluster: ' +
                error.message);
            if (targetClusterId.equals(_this.clusterId)) {
                _this.logger.warn('ConnectionManager', 'Retrying sending state to the cluster: ' +
                    targetClusterId + ', name: ' + clusterName);
                return _this.initializeClientOnCluster(targetClusterId);
            }
        });
    };
    ClientConnectionManager.prototype.tryConnectToAllClusterMembers = function (members) {
        var promises = [];
        for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
            var member = members_1[_i];
            promises.push(this.getOrConnect(member.address)
                .catch(function () {
                // No-op
            }));
        }
        return Promise.all(promises)
            .then(function () { return undefined; });
    };
    return ClientConnectionManager;
}(events_1.EventEmitter));
exports.ClientConnectionManager = ClientConnectionManager;
//# sourceMappingURL=ClientConnectionManager.js.map