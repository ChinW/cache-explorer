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
var ClientStatisticsCodec_1 = require("../codec/ClientStatisticsCodec");
var Util = require("../Util");
var os = require("os");
var BuildInfo_1 = require("../BuildInfo");
var Long = require("long");
/**
 * This class is the main entry point for collecting and sending the client
 * statistics to the cluster. If the client statistics feature is enabled,
 * it will be scheduled for periodic statistics collection and sent.
 */
var Statistics = /** @class */ (function () {
    function Statistics(clientInstance) {
        this.allGauges = {};
        this.properties = clientInstance.getConfig().properties;
        this.enabled = this.properties[Statistics.ENABLED];
        this.client = clientInstance;
        this.logger = this.client.getLoggingService().getLogger();
    }
    /**
     * Registers all client statistics and schedules periodic collection of stats.
     */
    Statistics.prototype.start = function () {
        if (!this.enabled) {
            return;
        }
        this.registerMetrics();
        var periodSeconds = this.properties[Statistics.PERIOD_SECONDS];
        if (periodSeconds <= 0) {
            var defaultValue = Statistics.PERIOD_SECONDS_DEFAULT_VALUE;
            this.logger.warn('Statistics', 'Provided client statistics ' + Statistics.PERIOD_SECONDS
                + ' can not be less than or equal to 0. You provided ' + periodSeconds
                + ' seconds as the configuration. Client will use the default value of ' + defaultValue + ' instead.');
            periodSeconds = defaultValue;
        }
        this.task = this.schedulePeriodicStatisticsSendTask(periodSeconds);
        this.logger.info('Statistics', 'Client statistics is enabled with period ' + periodSeconds + ' seconds.');
    };
    Statistics.prototype.stop = function () {
        if (this.task != null) {
            Util.cancelRepetitionTask(this.task);
        }
    };
    /**
     * @param periodSeconds the interval at which the statistics collection and send is being run
     */
    Statistics.prototype.schedulePeriodicStatisticsSendTask = function (periodSeconds) {
        var _this = this;
        return Util.scheduleWithRepetition(function () {
            var collectionTimestamp = Long.fromNumber(Date.now());
            var connection = _this.client.getConnectionManager().getRandomConnection();
            if (connection == null) {
                _this.logger.trace('Statistics', 'Can not send client statistics to the server. No connection found.');
                return;
            }
            var stats = [];
            _this.fillMetrics(stats, connection);
            _this.addNearCacheStats(stats);
            _this.sendStats(collectionTimestamp, stats.join(''), connection);
        }, 0, periodSeconds * 1000);
    };
    Statistics.prototype.sendStats = function (collectionTimestamp, newStats, connection) {
        var _this = this;
        var request = ClientStatisticsCodec_1.ClientStatisticsCodec.encodeRequest(collectionTimestamp, newStats, Buffer.allocUnsafe(0));
        this.client.getInvocationService()
            .invokeOnConnection(connection, request)
            .catch(function (err) {
            _this.logger.trace('Statistics', 'Could not send stats ', err);
        });
    };
    Statistics.prototype.registerMetrics = function () {
        this.registerGauge('os.committedVirtualMemorySize', function () { return Statistics.EMPTY_STAT_VALUE; });
        this.registerGauge('os.freePhysicalMemorySize', function () { return os.freemem(); });
        this.registerGauge('os.freeSwapSpaceSize', function () { return Statistics.EMPTY_STAT_VALUE; });
        this.registerGauge('os.maxFileDescriptorCount', function () { return Statistics.EMPTY_STAT_VALUE; });
        this.registerGauge('os.openFileDescriptorCount', function () { return Statistics.EMPTY_STAT_VALUE; });
        this.registerGauge('os.processCpuTime', function () {
            // Nodejs 4 does not support this metric. So we do not print an ugly warning for that.
            if (Util.getNodejsMajorVersion() >= 6) {
                return process.cpuUsage().user * 1000; // process.cpuUsage returns micoseconds. We convert to nanoseconds.
            }
            else {
                return Statistics.EMPTY_STAT_VALUE;
            }
        });
        this.registerGauge('os.systemLoadAverage', function () { return os.loadavg()[0]; });
        this.registerGauge('os.totalPhysicalMemorySize', function () { return os.totalmem(); });
        this.registerGauge('os.totalSwapSpaceSize', function () { return Statistics.EMPTY_STAT_VALUE; });
        this.registerGauge('runtime.availableProcessors', function () { return os.cpus().length; });
        this.registerGauge('runtime.freeMemory', function () { return Statistics.EMPTY_STAT_VALUE; });
        this.registerGauge('runtime.maxMemory', function () { return Statistics.EMPTY_STAT_VALUE; });
        this.registerGauge('runtime.totalMemory', function () { return process.memoryUsage().heapTotal; });
        this.registerGauge('runtime.uptime', function () { return process.uptime() * 1000; });
        this.registerGauge('runtime.usedMemory', function () { return process.memoryUsage().heapUsed; });
        this.registerGauge('executionService.userExecutorQueueSize', function () { return Statistics.EMPTY_STAT_VALUE; });
    };
    Statistics.prototype.registerGauge = function (gaugeName, gaugeFunc) {
        try {
            // try a gauge function read, we will register it if it succeeds.
            gaugeFunc();
            this.allGauges[gaugeName] = gaugeFunc;
        }
        catch (e) {
            this.logger.warn('Statistics', 'Could not collect data for gauge ' + gaugeName + ' , it won\'t be registered', e);
            this.allGauges[gaugeName] = function () { return Statistics.EMPTY_STAT_VALUE; };
        }
    };
    Statistics.prototype.addStat = function (stats, name, value, keyPrefix) {
        if (stats.length !== 0) {
            stats.push(Statistics.STAT_SEPARATOR);
        }
        if (keyPrefix != null) {
            stats.push(keyPrefix);
        }
        stats.push(name);
        stats.push(Statistics.KEY_VALUE_SEPARATOR);
        stats.push(value);
    };
    Statistics.prototype.addEmptyStat = function (stats, name, keyPrefix) {
        this.addStat(stats, name, Statistics.EMPTY_STAT_VALUE, keyPrefix);
    };
    Statistics.prototype.fillMetrics = function (stats, connection) {
        this.addStat(stats, 'lastStatisticsCollectionTime', Date.now());
        this.addStat(stats, 'enterprise', 'false');
        this.addStat(stats, 'clientType', this.client.getClusterService().getLocalClient().type);
        this.addStat(stats, 'clientVersion', BuildInfo_1.BuildInfo.getClientVersion());
        this.addStat(stats, 'clusterConnectionTimestamp', connection.getStartTime());
        this.addStat(stats, 'clientAddress', connection.getLocalAddress().toString());
        this.addStat(stats, 'clientName', this.client.getName());
        for (var gaugeName in this.allGauges) {
            var gaugeValueFunc = this.allGauges[gaugeName];
            try {
                var value = gaugeValueFunc();
                this.addStat(stats, gaugeName, value);
            }
            catch (e) {
                this.logger.trace('Could not collect data for gauge ' + gaugeName, e);
            }
        }
    };
    Statistics.prototype.getNameWithPrefix = function (name) {
        var escapedName = [Statistics.NEAR_CACHE_CATEGORY_PREFIX];
        var prefixLen = Statistics.NEAR_CACHE_CATEGORY_PREFIX.length;
        escapedName.push(name);
        if (escapedName[prefixLen] === '/') {
            escapedName.splice(prefixLen, 1);
        }
        this.escapeSpecialCharacters(escapedName, prefixLen);
        return escapedName;
    };
    Statistics.prototype.escapeSpecialCharacters = function (buffer, start) {
        for (var i = start; i < buffer.length; i++) {
            var c = buffer[i];
            if (c === '=' || c === '.' || c === ',' || c === Statistics.ESCAPE_CHAR) {
                buffer.splice(i, 0, Statistics.ESCAPE_CHAR);
                i++;
            }
        }
    };
    Statistics.prototype.addNearCacheStats = function (stats) {
        for (var _i = 0, _a = this.client.getNearCacheManager().listAllNearCaches(); _i < _a.length; _i++) {
            var nearCache = _a[_i];
            var nearCacheNameWithPrefix = this.getNameWithPrefix(nearCache.getName());
            nearCacheNameWithPrefix.push('.');
            var nearCacheStats = nearCache.getStatistics();
            var prefix = nearCacheNameWithPrefix.join('');
            this.addStat(stats, 'creationTime', nearCacheStats.creationTime, prefix);
            this.addStat(stats, 'evictions', nearCacheStats.evictedCount, prefix);
            this.addStat(stats, 'hits', nearCacheStats.hitCount, prefix);
            this.addEmptyStat(stats, 'lastPersistenceDuration', prefix);
            this.addEmptyStat(stats, 'lastPersistenceKeyCount', prefix);
            this.addEmptyStat(stats, 'lastPersistenceTime', prefix);
            this.addEmptyStat(stats, 'lastPersistenceWrittenBytes', prefix);
            this.addStat(stats, 'misses', nearCacheStats.missCount, prefix);
            this.addStat(stats, 'ownedEntryCount', nearCacheStats.entryCount, prefix);
            this.addStat(stats, 'expirations', nearCacheStats.expiredCount, prefix);
            this.addEmptyStat(stats, 'ownedEntryMemoryCost', prefix);
            this.addEmptyStat(stats, 'lastPersistenceFailure', prefix);
        }
    };
    Statistics.PERIOD_SECONDS_DEFAULT_VALUE = 3;
    Statistics.ENABLED = 'hazelcast.client.statistics.enabled';
    Statistics.PERIOD_SECONDS = 'hazelcast.client.statistics.period.seconds';
    Statistics.NEAR_CACHE_CATEGORY_PREFIX = 'nc.';
    Statistics.STAT_SEPARATOR = ',';
    Statistics.KEY_VALUE_SEPARATOR = '=';
    Statistics.ESCAPE_CHAR = '\\';
    Statistics.EMPTY_STAT_VALUE = '';
    return Statistics;
}());
exports.Statistics = Statistics;
//# sourceMappingURL=Statistics.js.map