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
var assert = require("assert");
var Promise = require("bluebird");
var HazelcastError_1 = require("../HazelcastError");
var Util_1 = require("../Util");
var ErrorsCodec_1 = require("../codec/builtin/ErrorsCodec");
var MAX_FAST_INVOCATION_COUNT = 5;
var PROPERTY_INVOCATION_RETRY_PAUSE_MILLIS = 'hazelcast.client.invocation.retry.pause.millis';
var PROPERTY_INVOCATION_TIMEOUT_MILLIS = 'hazelcast.client.invocation.timeout.millis';
/**
 * A request to be sent to a hazelcast node.
 */
var Invocation = /** @class */ (function () {
    function Invocation(client, request) {
        this.invokeCount = 0;
        /**
         * True if this invocation is urgent (can be invoked even in the client is in the disconnected state), false otherwise.
         */
        this.urgent = false;
        this.client = client;
        this.invocationService = client.getInvocationService();
        this.deadline = Date.now() + this.invocationService.getInvocationTimeoutMillis();
        this.request = request;
    }
    /**
     * @returns {boolean}
     */
    Invocation.prototype.hasPartitionId = function () {
        return this.hasOwnProperty('partitionId') && this.partitionId >= 0;
    };
    Invocation.prototype.shouldRetry = function (err) {
        if (this.connection != null && (err instanceof HazelcastError_1.IOError || err instanceof HazelcastError_1.TargetDisconnectedError)) {
            return false;
        }
        if (this.uuid != null && err instanceof HazelcastError_1.TargetNotMemberError) {
            // when invocation send to a specific member
            // if target is no longer a member, we should not retry
            // note that this exception could come from the server
            return false;
        }
        if (err instanceof HazelcastError_1.IOError || err instanceof HazelcastError_1.HazelcastInstanceNotActiveError || err instanceof HazelcastError_1.RetryableHazelcastError) {
            return true;
        }
        if (err instanceof HazelcastError_1.TargetDisconnectedError) {
            return this.request.isRetryable();
        }
        return false;
    };
    return Invocation;
}());
exports.Invocation = Invocation;
/**
 * Sends requests to appropriate nodes. Resolves waiting promises with responses.
 */
var InvocationService = /** @class */ (function () {
    function InvocationService(hazelcastClient) {
        this.correlationCounter = 1;
        this.eventHandlers = {};
        this.pending = {};
        this.client = hazelcastClient;
        this.connectionManager = hazelcastClient.getConnectionManager();
        this.partitionService = hazelcastClient.getPartitionService();
        this.logger = this.client.getLoggingService().getLogger();
        this.smartRoutingEnabled = hazelcastClient.getConfig().networkConfig.smartRouting;
        if (hazelcastClient.getConfig().networkConfig.smartRouting) {
            this.doInvoke = this.invokeSmart;
        }
        else {
            this.doInvoke = this.invokeNonSmart;
        }
        this.invocationRetryPauseMillis = this.client.getConfig().properties[PROPERTY_INVOCATION_RETRY_PAUSE_MILLIS];
        this.invocationTimeoutMillis = this.client.getConfig().properties[PROPERTY_INVOCATION_TIMEOUT_MILLIS];
        this.isShutdown = false;
    }
    InvocationService.prototype.shutdown = function () {
        this.isShutdown = true;
    };
    InvocationService.prototype.invoke = function (invocation) {
        invocation.deferred = Util_1.DeferredPromise();
        var newCorrelationId = this.correlationCounter++;
        invocation.request.setCorrelationId(newCorrelationId);
        this.doInvoke(invocation);
        return invocation.deferred.promise;
    };
    InvocationService.prototype.invokeUrgent = function (invocation) {
        invocation.urgent = true;
        return this.invoke(invocation);
    };
    /**
     * Invokes given invocation on specified connection.
     * @param connection
     * @param request
     * @param handler called with values returned from server for this invocation.
     * @returns
     */
    InvocationService.prototype.invokeOnConnection = function (connection, request, handler) {
        var invocation = new Invocation(this.client, request);
        invocation.connection = connection;
        if (handler) {
            invocation.handler = handler;
        }
        return this.invoke(invocation);
    };
    /**
     * Invokes given invocation on the node that owns given partition.
     * @param request
     * @param partitionId
     * @returns
     */
    InvocationService.prototype.invokeOnPartition = function (request, partitionId) {
        var invocation = new Invocation(this.client, request);
        invocation.partitionId = partitionId;
        return this.invoke(invocation);
    };
    /**
     * Invokes given invocation on the host with given UUID.
     * @param request
     * @param target
     * @returns
     */
    InvocationService.prototype.invokeOnTarget = function (request, target) {
        var invocation = new Invocation(this.client, request);
        invocation.uuid = target;
        return this.invoke(invocation);
    };
    /**
     * Invokes given invocation on any host.
     * Useful when an operation is not bound to any host but a generic operation.
     * @param request
     * @returns
     */
    InvocationService.prototype.invokeOnRandomTarget = function (request) {
        return this.invoke(new Invocation(this.client, request));
    };
    InvocationService.prototype.getInvocationTimeoutMillis = function () {
        return this.invocationTimeoutMillis;
    };
    InvocationService.prototype.getInvocationRetryPauseMillis = function () {
        return this.invocationRetryPauseMillis;
    };
    /**
     * Removes the handler for all event handlers with a specific correlation id.
     * @param id correlation id
     */
    InvocationService.prototype.removeEventHandler = function (id) {
        if (this.eventHandlers.hasOwnProperty('' + id)) {
            delete this.eventHandlers[id];
        }
    };
    /**
     * Extract codec specific properties in a protocol message and resolves waiting promise.
     * @param clientMessage
     */
    InvocationService.prototype.processResponse = function (clientMessage) {
        var _this = this;
        var correlationId = clientMessage.getCorrelationId();
        var messageType = clientMessage.getMessageType();
        if (clientMessage.startFrame.hasEventFlag()) {
            setImmediate(function () {
                if (_this.eventHandlers[correlationId] !== undefined) {
                    _this.eventHandlers[correlationId].handler(clientMessage);
                }
            });
            return;
        }
        var pendingInvocation = this.pending[correlationId];
        var deferred = pendingInvocation.deferred;
        if (messageType === ErrorsCodec_1.EXCEPTION_MESSAGE_TYPE) {
            var remoteError = this.client.getErrorFactory().createErrorFromClientMessage(clientMessage);
            this.notifyError(pendingInvocation, remoteError);
        }
        else {
            delete this.pending[correlationId];
            deferred.resolve(clientMessage);
        }
    };
    InvocationService.prototype.invokeSmart = function (invocation) {
        var _this = this;
        invocation.invokeCount++;
        if (!invocation.urgent) {
            var error = this.connectionManager.checkIfInvocationAllowed();
            if (error != null) {
                this.notifyError(invocation, error);
                return;
            }
        }
        var invocationPromise;
        if (invocation.hasOwnProperty('connection')) {
            invocationPromise = this.send(invocation, invocation.connection);
            invocationPromise.catch(function (err) {
                _this.notifyError(invocation, err);
            });
            return;
        }
        if (invocation.hasPartitionId()) {
            invocationPromise = this.invokeOnPartitionOwner(invocation, invocation.partitionId);
        }
        else if (invocation.hasOwnProperty('uuid')) {
            invocationPromise = this.invokeOnUuid(invocation, invocation.uuid);
        }
        else {
            invocationPromise = this.invokeOnRandomConnection(invocation);
        }
        invocationPromise.catch(function () {
            return _this.invokeOnRandomConnection(invocation);
        }).catch(function (err) {
            _this.notifyError(invocation, err);
        });
    };
    InvocationService.prototype.invokeNonSmart = function (invocation) {
        var _this = this;
        invocation.invokeCount++;
        if (!invocation.urgent) {
            var error = this.connectionManager.checkIfInvocationAllowed();
            if (error != null) {
                this.notifyError(invocation, error);
                return;
            }
        }
        var invocationPromise;
        if (invocation.hasOwnProperty('connection')) {
            invocationPromise = this.send(invocation, invocation.connection);
        }
        else {
            invocationPromise = this.invokeOnRandomConnection(invocation);
        }
        invocationPromise.catch(function (err) {
            _this.notifyError(invocation, err);
        });
    };
    InvocationService.prototype.invokeOnRandomConnection = function (invocation) {
        var connection = this.connectionManager.getRandomConnection();
        if (connection == null) {
            return Promise.reject(new HazelcastError_1.IOError('No connection found to invoke'));
        }
        return this.send(invocation, connection);
    };
    InvocationService.prototype.invokeOnUuid = function (invocation, target) {
        var connection = this.connectionManager.getConnection(target);
        if (connection == null) {
            this.logger.trace('InvocationService', "Client is not connected to target: " + target);
            return Promise.reject(new HazelcastError_1.IOError('No connection found to invoke'));
        }
        return this.send(invocation, connection);
    };
    InvocationService.prototype.invokeOnPartitionOwner = function (invocation, partitionId) {
        var partitionOwner = this.partitionService.getPartitionOwner(partitionId);
        if (partitionOwner == null) {
            this.logger.trace('InvocationService', 'Partition owner is not assigned yet');
            return Promise.reject(new HazelcastError_1.IOError('No connection found to invoke'));
        }
        return this.invokeOnUuid(invocation, partitionOwner);
    };
    InvocationService.prototype.send = function (invocation, connection) {
        assert(connection != null);
        if (this.isShutdown) {
            return Promise.reject(new HazelcastError_1.ClientNotActiveError('Client is shutdown.'));
        }
        this.registerInvocation(invocation);
        return this.write(invocation, connection);
    };
    InvocationService.prototype.write = function (invocation, connection) {
        return connection.write(invocation.request.toBuffer());
    };
    InvocationService.prototype.notifyError = function (invocation, error) {
        var correlationId = invocation.request.getCorrelationId();
        if (this.rejectIfNotRetryable(invocation, error)) {
            delete this.pending[correlationId];
            return;
        }
        this.logger.debug('InvocationService', 'Retrying(' + invocation.invokeCount + ') on correlation-id=' + correlationId, error);
        if (invocation.invokeCount < MAX_FAST_INVOCATION_COUNT) {
            this.doInvoke(invocation);
        }
        else {
            setTimeout(this.doInvoke.bind(this, invocation), this.getInvocationRetryPauseMillis());
        }
    };
    /**
     * Determines if an error is retryable. The given invocation is rejected with approprate error if the error is not retryable.
     * @param invocation
     * @param error
     * @returns `true` if invocation is rejected, `false` otherwise
     */
    InvocationService.prototype.rejectIfNotRetryable = function (invocation, error) {
        if (!this.client.getLifecycleService().isRunning()) {
            invocation.deferred.reject(new HazelcastError_1.ClientNotActiveError('Client is shutting down.', error));
            return true;
        }
        if (!invocation.shouldRetry(error)) {
            invocation.deferred.reject(error);
            return true;
        }
        if (invocation.deadline < Date.now()) {
            this.logger.trace('InvocationService', 'Error will not be retried because invocation timed out');
            invocation.deferred.reject(new HazelcastError_1.InvocationTimeoutError('Invocation ' + invocation.request.getCorrelationId() + ')'
                + ' reached its deadline.', error));
            return true;
        }
    };
    InvocationService.prototype.registerInvocation = function (invocation) {
        var message = invocation.request;
        var correlationId = message.getCorrelationId();
        if (invocation.hasPartitionId()) {
            message.setPartitionId(invocation.partitionId);
        }
        else {
            message.setPartitionId(-1);
        }
        if (invocation.hasOwnProperty('handler')) {
            this.eventHandlers[correlationId] = invocation;
        }
        this.pending[correlationId] = invocation;
    };
    return InvocationService;
}());
exports.InvocationService = InvocationService;
//# sourceMappingURL=InvocationService.js.map