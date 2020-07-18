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
var ClientPingCodec_1 = require("./codec/ClientPingCodec");
var Util_1 = require("./Util");
var HazelcastError_1 = require("./HazelcastError");
var InvocationService_1 = require("./invocation/InvocationService");
var PROPERTY_HEARTBEAT_INTERVAL = 'hazelcast.client.heartbeat.interval';
var PROPERTY_HEARTBEAT_TIMEOUT = 'hazelcast.client.heartbeat.timeout';
/**
 * HeartbeatManager manager used by connection manager.
 */
var HeartbeatManager = /** @class */ (function () {
    function HeartbeatManager(client, connectionManager) {
        this.client = client;
        this.connectionManager = connectionManager;
        this.logger = this.client.getLoggingService().getLogger();
        this.heartbeatInterval = this.client.getConfig().properties[PROPERTY_HEARTBEAT_INTERVAL];
        this.heartbeatTimeout = this.client.getConfig().properties[PROPERTY_HEARTBEAT_TIMEOUT];
    }
    /**
     * Starts sending periodic heartbeat operations.
     */
    HeartbeatManager.prototype.start = function () {
        this.timer = Util_1.scheduleWithRepetition(this.heartbeatFunction.bind(this), this.heartbeatInterval, this.heartbeatInterval);
    };
    /**
     * Cancels the periodic heartbeat operation.
     */
    HeartbeatManager.prototype.shutdown = function () {
        Util_1.cancelRepetitionTask(this.timer);
    };
    /**
     * Returns the heartbeat timeout in milliseconds.
     */
    HeartbeatManager.prototype.getHeartbeatTimeout = function () {
        return this.heartbeatTimeout;
    };
    HeartbeatManager.prototype.heartbeatFunction = function () {
        if (!this.connectionManager.isAlive()) {
            return;
        }
        var now = Date.now();
        var activeConnections = this.connectionManager.getActiveConnections();
        for (var _i = 0, activeConnections_1 = activeConnections; _i < activeConnections_1.length; _i++) {
            var connection = activeConnections_1[_i];
            this.checkConnection(now, connection);
        }
    };
    HeartbeatManager.prototype.checkConnection = function (now, connection) {
        if (!connection.isAlive()) {
            return;
        }
        if (now - connection.getLastReadTimeMillis() > this.heartbeatTimeout) {
            if (connection.isAlive()) {
                this.logger.warn('HeartbeatManager', "Heartbeat failed over connection: " + connection);
                this.onHeartbeatStopped(connection, 'Heartbeat timed out');
            }
        }
        if (now - connection.getLastWriteTimeMillis() > this.heartbeatInterval) {
            var request = ClientPingCodec_1.ClientPingCodec.encodeRequest();
            var invocation = new InvocationService_1.Invocation(this.client, request);
            invocation.connection = connection;
            this.client.getInvocationService()
                .invokeUrgent(invocation)
                .catch(function () {
                // No-op
            });
        }
    };
    HeartbeatManager.prototype.onHeartbeatStopped = function (connection, reason) {
        connection.close(reason, new HazelcastError_1.TargetDisconnectedError("Heartbeat timed out to connection " + connection));
    };
    return HeartbeatManager;
}());
exports.HeartbeatManager = HeartbeatManager;
//# sourceMappingURL=HeartbeatManager.js.map