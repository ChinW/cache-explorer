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
var HazelcastError_1 = require("./HazelcastError");
var PartitionTable = /** @class */ (function () {
    function PartitionTable() {
        this.partitionStateVersion = -1;
        this.partitions = new Map();
    }
    return PartitionTable;
}());
/**
 * Partition service for Hazelcast clients.
 *
 * Allows to retrieve information about the partition count, the partition owner or the partitionId of a key.
 */
var PartitionService = /** @class */ (function () {
    function PartitionService(client) {
        this.partitionTable = new PartitionTable();
        this.partitionCount = 0;
        this.client = client;
        this.logger = client.getLoggingService().getLogger();
    }
    /**
     * The partitions can be empty on the response, client will not apply the empty partition table.
     */
    PartitionService.prototype.handlePartitionViewEvent = function (connection, partitions, partitionStateVersion) {
        this.logger.debug('PartitionService', 'Handling new partition table with partitionStateVersion: ' + partitionStateVersion);
        if (!this.shouldBeApplied(connection, partitions, partitionStateVersion, this.partitionTable)) {
            return;
        }
        var newPartitions = this.convertToMap(partitions);
        this.partitionTable.connection = connection;
        this.partitionTable.partitionStateVersion = partitionStateVersion;
        this.partitionTable.partitions = newPartitions;
    };
    /**
     * @param partitionId
     * @return the owner of the partition or `undefined` if a partition is not assigned yet
     */
    PartitionService.prototype.getPartitionOwner = function (partitionId) {
        return this.getPartitions().get(partitionId);
    };
    /**
     * Computes the partition id for a given key.
     * @param key
     * @returns the partition id.
     * @throws ClientOfflineError if the partition table is not arrived yet.
     */
    PartitionService.prototype.getPartitionId = function (key) {
        if (this.partitionCount === 0) {
            // Partition count can not be zero for the sync mode.
            // On the sync mode, we are waiting for the first connection to be established.
            // We are initializing the partition count with the value coming from the server with authentication.
            // This exception is used only for async mode client.
            throw new HazelcastError_1.ClientOfflineError();
        }
        var partitionHash;
        if (typeof key === 'object' && 'getPartitionHash' in key) {
            partitionHash = key.getPartitionHash();
        }
        else {
            partitionHash = this.client.getSerializationService().toData(key).getPartitionHash();
        }
        return Math.abs(partitionHash) % this.partitionCount;
    };
    /**
     * If partition table is not fetched yet, this method returns zero
     *
     * @return the partition count
     */
    PartitionService.prototype.getPartitionCount = function () {
        return this.partitionCount;
    };
    /**
     * @param newPartitionCount
     * @return true if partition count can be set for the first time, or it is equal to
     * one that is already available, returns false otherwise
     */
    PartitionService.prototype.checkAndSetPartitionCount = function (newPartitionCount) {
        if (this.partitionCount === 0) {
            this.partitionCount = newPartitionCount;
            return true;
        }
        return this.partitionCount === newPartitionCount;
    };
    PartitionService.prototype.convertToMap = function (partitions) {
        var newPartitions = new Map();
        for (var _i = 0, partitions_1 = partitions; _i < partitions_1.length; _i++) {
            var entry = partitions_1[_i];
            var uuid = entry[0];
            var ownedPartitions = entry[1];
            for (var _a = 0, ownedPartitions_1 = ownedPartitions; _a < ownedPartitions_1.length; _a++) {
                var ownedPartition = ownedPartitions_1[_a];
                newPartitions.set(ownedPartition, uuid);
            }
        }
        return newPartitions;
    };
    PartitionService.prototype.logFailure = function (connection, partitionStateVersion, current, cause) {
        this.logger.debug('PartitionService', 'Response will not be applied since ' + cause
            + '. Response is from ' + connection
            + '. Current connection ' + current.connection
            + '. Response state version ' + partitionStateVersion
            + '. Current state version ' + current.partitionStateVersion);
    };
    PartitionService.prototype.getPartitions = function () {
        return this.partitionTable.partitions;
    };
    PartitionService.prototype.shouldBeApplied = function (connection, partitions, partitionStateVersion, current) {
        if (partitions.length === 0) {
            this.logFailure(connection, partitionStateVersion, current, 'response is empty');
            return false;
        }
        if (!connection.equals(current.connection)) {
            this.logger.trace('PartitionService', 'Event coming from a new connection. Old connection: ' + current.connection
                + ', new connection ' + connection);
            return true;
        }
        if (partitionStateVersion <= current.partitionStateVersion) {
            this.logFailure(connection, partitionStateVersion, current, 'response state version is old');
            return false;
        }
        return true;
    };
    return PartitionService;
}());
exports.PartitionService = PartitionService;
//# sourceMappingURL=PartitionService.js.map