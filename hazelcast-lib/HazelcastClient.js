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
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var ClientGetDistributedObjectsCodec_1 = require("./codec/ClientGetDistributedObjectsCodec");
var Config_1 = require("./config/Config");
var ConfigBuilder_1 = require("./config/ConfigBuilder");
var ClientConnectionManager_1 = require("./network/ClientConnectionManager");
var ClusterService_1 = require("./invocation/ClusterService");
var InvocationService_1 = require("./invocation/InvocationService");
var LifecycleService_1 = require("./LifecycleService");
var ListenerService_1 = require("./ListenerService");
var LockReferenceIdGenerator_1 = require("./LockReferenceIdGenerator");
var LoggingService_1 = require("./logging/LoggingService");
var RepairingTask_1 = require("./nearcache/RepairingTask");
var PartitionService_1 = require("./PartitionService");
var ErrorFactory_1 = require("./protocol/ErrorFactory");
var ProxyManager_1 = require("./proxy/ProxyManager");
var SerializationService_1 = require("./serialization/SerializationService");
var HazelcastCloudAddressProvider_1 = require("./discovery/HazelcastCloudAddressProvider");
var DefaultAddressProvider_1 = require("./connection/DefaultAddressProvider");
var HazelcastCloudDiscovery_1 = require("./discovery/HazelcastCloudDiscovery");
var Statistics_1 = require("./statistics/Statistics");
var NearCacheManager_1 = require("./nearcache/NearCacheManager");
var HazelcastError_1 = require("./HazelcastError");
var RoundRobinLB_1 = require("./util/RoundRobinLB");
var ClusterViewListenerService_1 = require("./listener/ClusterViewListenerService");
var HazelcastClient = /** @class */ (function () {
    function HazelcastClient(config) {
        this.id = HazelcastClient.CLIENT_ID++;
        this.config = new Config_1.ClientConfig();
        this.config = config;
        if (config.getInstanceName() != null) {
            this.instanceName = config.getInstanceName();
        }
        else {
            this.instanceName = 'hz.client_' + this.id;
        }
        this.loggingService = new LoggingService_1.LoggingService(this.config.customLogger, this.config.properties['hazelcast.logging.level']);
        this.loadBalancer = this.initLoadBalancer();
        this.listenerService = new ListenerService_1.ListenerService(this);
        this.serializationService = new SerializationService_1.SerializationServiceV1(this, this.config.serializationConfig);
        this.nearCacheManager = new NearCacheManager_1.NearCacheManager(this);
        this.partitionService = new PartitionService_1.PartitionService(this);
        this.addressProvider = this.createAddressProvider();
        this.connectionManager = new ClientConnectionManager_1.ClientConnectionManager(this);
        this.invocationService = new InvocationService_1.InvocationService(this);
        this.proxyManager = new ProxyManager_1.ProxyManager(this);
        this.clusterService = new ClusterService_1.ClusterService(this);
        this.lifecycleService = new LifecycleService_1.LifecycleService(this);
        this.lockReferenceIdGenerator = new LockReferenceIdGenerator_1.LockReferenceIdGenerator();
        this.errorFactory = new ErrorFactory_1.ClientErrorFactory();
        this.statistics = new Statistics_1.Statistics(this);
        this.clusterViewListenerService = new ClusterViewListenerService_1.ClusterViewListenerService(this);
    }
    /**
     * Creates a new client object and automatically connects to cluster.
     * @param config Default {@link ClientConfig} is used when this parameter is absent.
     * @returns a new client instance
     */
    HazelcastClient.newHazelcastClient = function (config) {
        if (config == null) {
            var configBuilder_1 = new ConfigBuilder_1.ConfigBuilder();
            return configBuilder_1.loadConfig().then(function () {
                var client = new HazelcastClient(configBuilder_1.build());
                return client.init();
            });
        }
        else {
            var client = new HazelcastClient(config);
            return client.init();
        }
    };
    /**
     * Returns the name of this Hazelcast instance.
     *
     * @return name of this Hazelcast instance
     */
    HazelcastClient.prototype.getName = function () {
        return this.instanceName;
    };
    /**
     * Gathers information of this local client.
     * @returns {ClientInfo}
     */
    HazelcastClient.prototype.getLocalEndpoint = function () {
        return this.clusterService.getLocalClient();
    };
    /**
     * Gives all known distributed objects in cluster.
     * @returns {Promise<DistributedObject[]>|Promise<T>}
     */
    HazelcastClient.prototype.getDistributedObjects = function () {
        var _this = this;
        var clientMessage = ClientGetDistributedObjectsCodec_1.ClientGetDistributedObjectsCodec.encodeRequest();
        var localDistributedObjects;
        var responseMessage;
        return this.invocationService.invokeOnRandomTarget(clientMessage)
            .then(function (resp) {
            responseMessage = resp;
            return _this.proxyManager.getDistributedObjects();
        })
            .then(function (distributedObjects) {
            localDistributedObjects = new Set();
            distributedObjects.forEach(function (obj) {
                localDistributedObjects.add(obj.getServiceName() + ProxyManager_1.NAMESPACE_SEPARATOR + obj.getName());
            });
            var newDistributedObjectInfos = ClientGetDistributedObjectsCodec_1.ClientGetDistributedObjectsCodec.decodeResponse(responseMessage).response;
            var createLocalProxiesPromise = newDistributedObjectInfos.map(function (doi) {
                return _this.proxyManager.getOrCreateProxy(doi.name, doi.serviceName, false)
                    .then(function () { return localDistributedObjects.delete(doi.serviceName + ProxyManager_1.NAMESPACE_SEPARATOR + doi.name); });
            });
            return Promise.all(createLocalProxiesPromise);
        })
            .then(function () {
            var destroyLocalProxiesPromises = new Array(localDistributedObjects.size);
            var index = 0;
            localDistributedObjects.forEach(function (namespace) {
                destroyLocalProxiesPromises[index++] = _this.proxyManager.destroyProxyLocally(namespace);
            });
            return Promise.all(destroyLocalProxiesPromises);
        })
            .then(function () {
            return _this.proxyManager.getDistributedObjects();
        });
    };
    /**
     * Returns the distributed map instance with given name.
     * @param name
     * @returns {Promise<IMap<K, V>>}
     */
    HazelcastClient.prototype.getMap = function (name) {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager_1.ProxyManager.MAP_SERVICE);
    };
    /**
     * Returns the distributed set instance with given name.
     * @param name
     * @returns {Promise<ISet<E>>}
     */
    HazelcastClient.prototype.getSet = function (name) {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager_1.ProxyManager.SET_SERVICE);
    };
    /**
     * Returns the distributed queue instance with given name.
     * @param name
     * @returns {Promise<IQueue<E>>}
     */
    HazelcastClient.prototype.getQueue = function (name) {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager_1.ProxyManager.QUEUE_SERVICE);
    };
    /**
     * Returns the distributed list instance with given name.
     * @param name
     * @returns {Promise<IList<E>>}
     */
    HazelcastClient.prototype.getList = function (name) {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager_1.ProxyManager.LIST_SERVICE);
    };
    /**
     * Returns the distributed multi-map instance with given name.
     * @param name
     * @returns {Promise<MultiMap<K, V>>}
     */
    HazelcastClient.prototype.getMultiMap = function (name) {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager_1.ProxyManager.MULTIMAP_SERVICE);
    };
    /**
     * Returns a distributed ringbuffer instance with the given name.
     * @param name
     * @returns {Promise<Ringbuffer<E>>}
     */
    HazelcastClient.prototype.getRingbuffer = function (name) {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager_1.ProxyManager.RINGBUFFER_SERVICE);
    };
    /**
     * Returns a distributed reliable topic instance with the given name.
     * @param name
     * @returns {Promise<ITopic<E>>}
     */
    HazelcastClient.prototype.getReliableTopic = function (name) {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager_1.ProxyManager.RELIABLETOPIC_SERVICE);
    };
    /**
     * Returns the distributed replicated-map instance with given name.
     * @param name
     * @returns {Promise<ReplicatedMap<K, V>>}
     */
    HazelcastClient.prototype.getReplicatedMap = function (name) {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager_1.ProxyManager.REPLICATEDMAP_SERVICE);
    };
    /**
     * Returns the distributed flake ID generator instance with given name.
     * @param name
     * @returns {Promise<FlakeIdGenerator>}
     */
    HazelcastClient.prototype.getFlakeIdGenerator = function (name) {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager_1.ProxyManager.FLAKEID_SERVICE);
    };
    /**
     * Returns the distributed PN Counter instance with given name.
     * @param name
     * @returns {Promise<PNCounter>}
     */
    HazelcastClient.prototype.getPNCounter = function (name) {
        return this.proxyManager.getOrCreateProxy(name, ProxyManager_1.ProxyManager.PNCOUNTER_SERVICE);
    };
    /**
     * Return configuration that this instance started with.
     * Returned configuration object should not be modified.
     * @returns {ClientConfig}
     */
    HazelcastClient.prototype.getConfig = function () {
        return this.config;
    };
    HazelcastClient.prototype.getSerializationService = function () {
        return this.serializationService;
    };
    HazelcastClient.prototype.getInvocationService = function () {
        return this.invocationService;
    };
    HazelcastClient.prototype.getListenerService = function () {
        return this.listenerService;
    };
    HazelcastClient.prototype.getConnectionManager = function () {
        return this.connectionManager;
    };
    HazelcastClient.prototype.getPartitionService = function () {
        return this.partitionService;
    };
    HazelcastClient.prototype.getProxyManager = function () {
        return this.proxyManager;
    };
    HazelcastClient.prototype.getNearCacheManager = function () {
        return this.nearCacheManager;
    };
    HazelcastClient.prototype.getClusterService = function () {
        return this.clusterService;
    };
    HazelcastClient.prototype.getLifecycleService = function () {
        return this.lifecycleService;
    };
    HazelcastClient.prototype.getRepairingTask = function () {
        if (this.mapRepairingTask == null) {
            this.mapRepairingTask = new RepairingTask_1.RepairingTask(this);
        }
        return this.mapRepairingTask;
    };
    HazelcastClient.prototype.getLoggingService = function () {
        return this.loggingService;
    };
    /**
     * Registers a distributed object listener to cluster.
     * @param listenerFunc Callback function will be called with following arguments.
     * <ul>
     *     <li>service name</li>
     *     <li>distributed object name</li>
     *     <li>name of the event that happened: either 'created' or 'destroyed'</li>
     * </ul>
     * @returns registration id of the listener.
     */
    HazelcastClient.prototype.addDistributedObjectListener = function (distributedObjectListener) {
        return this.proxyManager.addDistributedObjectListener(distributedObjectListener);
    };
    /**
     * Removes a distributed object listener from cluster.
     * @param listenerId id of the listener to be removed.
     * @returns `true` if registration is removed, `false` otherwise.
     */
    HazelcastClient.prototype.removeDistributedObjectListener = function (listenerId) {
        return this.proxyManager.removeDistributedObjectListener(listenerId);
    };
    HazelcastClient.prototype.getLockReferenceIdGenerator = function () {
        return this.lockReferenceIdGenerator;
    };
    HazelcastClient.prototype.getErrorFactory = function () {
        return this.errorFactory;
    };
    /**
     * Returns the {@link AddressProvider} of the client.
     */
    HazelcastClient.prototype.getAddressProvider = function () {
        return this.addressProvider;
    };
    HazelcastClient.prototype.getLoadBalancer = function () {
        return this.loadBalancer;
    };
    HazelcastClient.prototype.doShutdown = function () {
        if (this.mapRepairingTask !== undefined) {
            this.mapRepairingTask.shutdown();
        }
        this.nearCacheManager.destroyAllNearCaches();
        this.proxyManager.destroy();
        this.connectionManager.shutdown();
        this.invocationService.shutdown();
        this.statistics.stop();
    };
    /**
     * Shuts down this client instance.
     */
    HazelcastClient.prototype.shutdown = function () {
        this.getLifecycleService().shutdown();
    };
    HazelcastClient.prototype.onClusterRestart = function () {
        this.getLoggingService().getLogger()
            .info('HazelcastClient', 'Clearing local state of the client, because of a cluster restart');
        this.nearCacheManager.clearAllNearCaches();
        this.clusterService.clearMemberListVersion();
    };
    HazelcastClient.prototype.sendStateToCluster = function () {
        return this.proxyManager.createDistributedObjectsOnCluster();
    };
    HazelcastClient.prototype.init = function () {
        var _this = this;
        try {
            this.lifecycleService.start();
            var configuredMembershipListeners = this.config.listeners.getMembershipListeners();
            this.clusterService.start(configuredMembershipListeners);
            this.clusterViewListenerService.start();
        }
        catch (e) {
            this.loggingService.getLogger().error('HazelcastClient', 'Client failed to start', e);
            throw e;
        }
        return this.connectionManager.start()
            .then(function () {
            var connectionStrategyConfig = _this.config.connectionStrategyConfig;
            if (!connectionStrategyConfig.asyncStart) {
                return _this.clusterService.waitInitialMemberListFetched()
                    .then(function () { return _this.connectionManager.connectToAllClusterMembers(); });
            }
        })
            .then(function () {
            _this.listenerService.start();
            _this.proxyManager.init();
            _this.loadBalancer.initLoadBalancer(_this.clusterService, _this.config);
            _this.statistics.start();
            return _this.sendStateToCluster();
        })
            .then(function () {
            return _this;
        })
            .catch(function (e) {
            _this.loggingService.getLogger().error('HazelcastClient', 'Client failed to start', e);
            throw e;
        });
    };
    HazelcastClient.prototype.initLoadBalancer = function () {
        var lb = this.config.loadBalancer;
        if (lb == null) {
            lb = new RoundRobinLB_1.RoundRobinLB();
        }
        return lb;
    };
    HazelcastClient.prototype.createAddressProvider = function () {
        var networkConfig = this.getConfig().networkConfig;
        var addressListProvided = networkConfig.addresses.length !== 0;
        var hazelcastCloudEnabled = networkConfig.cloudConfig.enabled;
        if (addressListProvided && hazelcastCloudEnabled) {
            throw new HazelcastError_1.IllegalStateError('Only one discovery method can be enabled at a time. '
                + 'Cluster members given explicitly: ' + addressListProvided
                + ', hazelcast.cloud enabled: ' + hazelcastCloudEnabled);
        }
        var cloudAddressProvider = this.initCloudAddressProvider();
        if (cloudAddressProvider != null) {
            return cloudAddressProvider;
        }
        return new DefaultAddressProvider_1.DefaultAddressProvider(networkConfig);
    };
    HazelcastClient.prototype.initCloudAddressProvider = function () {
        var cloudConfig = this.getConfig().networkConfig.cloudConfig;
        if (cloudConfig.enabled) {
            var discoveryToken = cloudConfig.discoveryToken;
            var urlEndpoint = HazelcastCloudDiscovery_1.HazelcastCloudDiscovery.createUrlEndpoint(this.getConfig().properties, discoveryToken);
            return new HazelcastCloudAddressProvider_1.HazelcastCloudAddressProvider(urlEndpoint, this.getConnectionTimeoutMillis(), this.loggingService.getLogger());
        }
        return null;
    };
    HazelcastClient.prototype.getConnectionTimeoutMillis = function () {
        var networkConfig = this.getConfig().networkConfig;
        var connTimeout = networkConfig.connectionTimeout;
        return connTimeout === 0 ? Number.MAX_VALUE : connTimeout;
    };
    HazelcastClient.CLIENT_ID = 0;
    return HazelcastClient;
}());
exports.default = HazelcastClient;
//# sourceMappingURL=HazelcastClient.js.map