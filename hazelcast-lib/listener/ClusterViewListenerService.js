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
var ClientAddClusterViewListenerCodec_1 = require("../codec/ClientAddClusterViewListenerCodec");
var InvocationService_1 = require("../invocation/InvocationService");
/**
 * Adds cluster listener to one of the connections. If that connection is removed,
 * it registers connection to any other connection
 */
var ClusterViewListenerService = /** @class */ (function () {
    function ClusterViewListenerService(client) {
        this.client = client;
        this.logger = client.getLoggingService().getLogger();
        this.connectionManager = client.getConnectionManager();
        this.partitionService = client.getPartitionService();
        this.clusterService = client.getClusterService();
    }
    ClusterViewListenerService.prototype.start = function () {
        this.connectionManager.on('connectionAdded', this.connectionAdded.bind(this));
        this.connectionManager.on('connectionRemoved', this.connectionRemoved.bind(this));
    };
    ClusterViewListenerService.prototype.connectionAdded = function (connection) {
        this.tryRegister(connection);
    };
    ClusterViewListenerService.prototype.connectionRemoved = function (connection) {
        this.tryRegisterToRandomConnection(connection);
    };
    ClusterViewListenerService.prototype.tryRegister = function (connection) {
        var _this = this;
        if (this.listenerAddedConnection != null) {
            // already registering/registered to another connection
            return;
        }
        this.listenerAddedConnection = connection;
        var request = ClientAddClusterViewListenerCodec_1.ClientAddClusterViewListenerCodec.encodeRequest();
        var handler = this.createClusterViewEventHandler(connection);
        var invocation = new InvocationService_1.Invocation(this.client, request);
        invocation.connection = connection;
        invocation.handler = handler;
        this.logger.trace('ClusterViewListenerService', "Register attempt of cluster view handler to " + connection);
        this.client.getInvocationService().invokeUrgent(invocation)
            .then(function () {
            _this.logger.trace('ClusterViewListenerService', "Registered cluster view handler to " + connection);
        })
            .catch(function () {
            // listener needs to be re-registered
            _this.tryRegisterToRandomConnection(connection);
        });
    };
    ClusterViewListenerService.prototype.tryRegisterToRandomConnection = function (oldConnection) {
        if (this.listenerAddedConnection !== oldConnection) {
            // somebody else already trying to re-register
            return;
        }
        this.listenerAddedConnection = null;
        var newConnection = this.connectionManager.getRandomConnection();
        if (newConnection != null) {
            this.tryRegister(newConnection);
        }
    };
    ClusterViewListenerService.prototype.createClusterViewEventHandler = function (connection) {
        var _this = this;
        return function (clientMessage) {
            ClientAddClusterViewListenerCodec_1.ClientAddClusterViewListenerCodec.handle(clientMessage, _this.clusterService.handleMembersViewEvent.bind(_this.clusterService), function (version, partitions) {
                _this.partitionService.handlePartitionViewEvent(connection, partitions, version);
            });
        };
    };
    return ClusterViewListenerService;
}());
exports.ClusterViewListenerService = ClusterViewListenerService;
//# sourceMappingURL=ClusterViewListenerService.js.map