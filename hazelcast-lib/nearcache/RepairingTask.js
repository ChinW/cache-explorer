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
var Long = require("long");
var MetadataFetcher_1 = require("./MetadataFetcher");
var RepairingHandler_1 = require("./RepairingHandler");
var Promise = require("bluebird");
var PROPERTY_MAX_RECONCILIATION_INTERVAL_SECONDS = 'hazelcast.invalidation.reconciliation.interval.seconds';
var PROPERTY_MIN_RECONCILIATION_INTERVAL_SECONDS = 'hazelcast.invalidation.min.reconciliation.interval.seconds';
var PROPERTY_MAX_TOLERATED_MISS_COUNT = 'hazelcast.invalidation.max.tolerated.miss.count';
var RepairingTask = /** @class */ (function () {
    function RepairingTask(client) {
        this.client = client;
        this.logger = this.client.getLoggingService().getLogger();
        var config = this.client.getConfig();
        this.minAllowedReconciliationSeconds = config.properties[PROPERTY_MIN_RECONCILIATION_INTERVAL_SECONDS];
        var requestedReconciliationSeconds = config.properties[PROPERTY_MAX_RECONCILIATION_INTERVAL_SECONDS];
        this.reconcilliationInterval = this.getReconciliationIntervalMillis(requestedReconciliationSeconds);
        this.handlers = new Map();
        this.localUuid = this.client.getLocalEndpoint().uuid;
        this.maxToleratedMissCount = config.properties[PROPERTY_MAX_TOLERATED_MISS_COUNT];
        this.metadataFetcher = new MetadataFetcher_1.MetadataFetcher(client);
        this.partitionCount = this.client.getPartitionService().getPartitionCount();
    }
    RepairingTask.prototype.registerAndGetHandler = function (objectName, nearCache) {
        var _this = this;
        var handler = this.handlers.get(objectName);
        if (handler !== undefined) {
            return Promise.resolve(handler);
        }
        handler = new RepairingHandler_1.RepairingHandler(objectName, this.client.getPartitionService(), nearCache, this.localUuid);
        return this.metadataFetcher.initHandler(handler).then(function () {
            _this.handlers.set(objectName, handler);
            if (_this.antientropyTaskHandle === undefined) {
                _this.start();
            }
            return handler;
        });
    };
    RepairingTask.prototype.deregisterHandler = function (objectName) {
        this.handlers.delete(objectName);
    };
    RepairingTask.prototype.start = function () {
        assert(this.reconcilliationInterval > 0);
        this.antientropyTaskHandle = setInterval(this.antiEntropyTask.bind(this), this.reconcilliationInterval);
    };
    RepairingTask.prototype.shutdown = function () {
        if (this.antientropyTaskHandle != null) {
            clearInterval(this.antientropyTaskHandle);
        }
    };
    RepairingTask.prototype.antiEntropyTask = function () {
        var _this = this;
        if (this.client.getLifecycleService().isRunning()) {
            this.handlers.forEach(function (handler) {
                if (_this.isAboveMaxToleratedMissCount(handler)) {
                    _this.updateLastKnownStaleSequences(handler);
                }
            });
            this.metadataFetcher.fetchMetadata(this.handlers);
        }
        else {
            this.shutdown();
            this.logger.debug('RepairingTask', 'Anti entropy task was on although client was not running.' +
                'Anti entropy task was shutdown forcibly.');
        }
    };
    RepairingTask.prototype.isAboveMaxToleratedMissCount = function (handler) {
        var totalMissCount = Long.fromNumber(0);
        for (var i = 0; i < this.partitionCount; i++) {
            var added = handler.getMetadataContainer(i).getMissedSequenceCount();
            totalMissCount = totalMissCount.add(added);
            if (totalMissCount.greaterThanOrEqual(this.maxToleratedMissCount)) {
                return true;
            }
        }
        return false;
    };
    RepairingTask.prototype.updateLastKnownStaleSequences = function (handler) {
        for (var i = 0; i < this.partitionCount; i++) {
            var container = handler.getMetadataContainer(i);
            var missedCount = container.getMissedSequenceCount();
            if (missedCount.notEquals(0)) {
                container.increaseMissedSequenceCount(missedCount.negate());
                handler.updateLastKnownStaleSequence(container);
            }
        }
    };
    RepairingTask.prototype.getReconciliationIntervalMillis = function (seconds) {
        if (seconds === 0 || seconds >= this.minAllowedReconciliationSeconds) {
            return seconds * 1000;
        }
        else {
            var message = 'Reconciliation interval can be at least ' + this.minAllowedReconciliationSeconds + ' seconds ' +
                'if not 0. Configured interval is ' + seconds + ' seconds. ' +
                'Note: configuring a value of 0 seconds disables the reconciliation task.';
            throw new RangeError(message);
        }
    };
    return RepairingTask;
}());
exports.RepairingTask = RepairingTask;
//# sourceMappingURL=RepairingTask.js.map