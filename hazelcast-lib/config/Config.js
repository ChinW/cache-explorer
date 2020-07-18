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
var TopicOverloadPolicy_1 = require("../proxy/topic/TopicOverloadPolicy");
exports.TopicOverloadPolicy = TopicOverloadPolicy_1.TopicOverloadPolicy;
var ClientNetworkConfig_1 = require("./ClientNetworkConfig");
exports.ClientNetworkConfig = ClientNetworkConfig_1.ClientNetworkConfig;
var ConfigPatternMatcher_1 = require("./ConfigPatternMatcher");
var EvictionPolicy_1 = require("./EvictionPolicy");
exports.EvictionPolicy = EvictionPolicy_1.EvictionPolicy;
var FlakeIdGeneratorConfig_1 = require("./FlakeIdGeneratorConfig");
exports.FlakeIdGeneratorConfig = FlakeIdGeneratorConfig_1.FlakeIdGeneratorConfig;
var InMemoryFormat_1 = require("./InMemoryFormat");
exports.InMemoryFormat = InMemoryFormat_1.InMemoryFormat;
var ListenerConfig_1 = require("./ListenerConfig");
var NearCacheConfig_1 = require("./NearCacheConfig");
exports.NearCacheConfig = NearCacheConfig_1.NearCacheConfig;
var SSLConfig_1 = require("./SSLConfig");
exports.SSLConfig = SSLConfig_1.SSLConfig;
var ReliableTopicConfig_1 = require("./ReliableTopicConfig");
exports.ReliableTopicConfig = ReliableTopicConfig_1.ReliableTopicConfig;
var SerializationConfig_1 = require("./SerializationConfig");
exports.SerializationConfig = SerializationConfig_1.SerializationConfig;
var Statistics_1 = require("../statistics/Statistics");
var __1 = require("..");
var JsonStringDeserializationPolicy_1 = require("./JsonStringDeserializationPolicy");
exports.JsonStringDeserializationPolicy = JsonStringDeserializationPolicy_1.JsonStringDeserializationPolicy;
var ConnectionStrategyConfig_1 = require("./ConnectionStrategyConfig");
exports.ConnectionStrategyConfig = ConnectionStrategyConfig_1.ConnectionStrategyConfig;
exports.ReconnectMode = ConnectionStrategyConfig_1.ReconnectMode;
var IndexConfig_1 = require("./IndexConfig");
exports.IndexConfig = IndexConfig_1.IndexConfig;
var IndexType_1 = require("./IndexType");
exports.IndexType = IndexType_1.IndexType;
var ConnectionRetryConfig_1 = require("./ConnectionRetryConfig");
exports.ConnectionRetryConfig = ConnectionRetryConfig_1.ConnectionRetryConfig;
var DEFAULT_CLUSTER_NAME = 'dev';
/**
 * Top level configuration object of Hazelcast client. Other configurations items are properties of this object.
 */
var ClientConfig = /** @class */ (function () {
    function ClientConfig() {
        this.properties = {
            'hazelcast.client.heartbeat.interval': 5000,
            'hazelcast.client.heartbeat.timeout': 60000,
            'hazelcast.client.invocation.retry.pause.millis': 1000,
            'hazelcast.client.invocation.timeout.millis': 120000,
            'hazelcast.client.cloud.url': 'https://coordinator.hazelcast.cloud',
            'hazelcast.client.statistics.enabled': false,
            'hazelcast.client.statistics.period.seconds': Statistics_1.Statistics.PERIOD_SECONDS_DEFAULT_VALUE,
            'hazelcast.invalidation.reconciliation.interval.seconds': 60,
            'hazelcast.invalidation.max.tolerated.miss.count': 10,
            'hazelcast.invalidation.min.reconciliation.interval.seconds': 30,
            'hazelcast.logging.level': __1.LogLevel.INFO,
            'hazelcast.client.autopipelining.enabled': true,
            'hazelcast.client.autopipelining.threshold.bytes': 8192,
            'hazelcast.client.socket.no.delay': true,
            'hazelcast.client.shuffle.member.list': true,
        };
        this.networkConfig = new ClientNetworkConfig_1.ClientNetworkConfig();
        this.customCredentials = null;
        this.listeners = new ListenerConfig_1.ListenerConfig();
        this.listenerConfigs = [];
        this.serializationConfig = new SerializationConfig_1.SerializationConfig();
        this.reliableTopicConfigs = {};
        this.nearCacheConfigs = {};
        this.flakeIdGeneratorConfigs = {};
        this.connectionStrategyConfig = new ConnectionStrategyConfig_1.ConnectionStrategyConfig();
        this.clusterName = DEFAULT_CLUSTER_NAME;
        this.labels = new Set();
        this.configPatternMatcher = new ConfigPatternMatcher_1.ConfigPatternMatcher();
    }
    ClientConfig.prototype.getInstanceName = function () {
        return this.instanceName;
    };
    ClientConfig.prototype.getReliableTopicConfig = function (name) {
        var matching = this.lookupByPattern(this.reliableTopicConfigs, name);
        var config;
        if (matching != null) {
            config = matching.clone();
        }
        else {
            config = new ReliableTopicConfig_1.ReliableTopicConfig();
        }
        config.name = name;
        return config;
    };
    ClientConfig.prototype.getNearCacheConfig = function (name) {
        var matching = this.lookupByPattern(this.nearCacheConfigs, name);
        if (matching == null) {
            return null;
        }
        var config = matching.clone();
        config.name = name;
        return config;
    };
    ClientConfig.prototype.getFlakeIdGeneratorConfig = function (name) {
        var matching = this.lookupByPattern(this.flakeIdGeneratorConfigs, name);
        var config;
        if (matching != null) {
            config = matching.clone();
        }
        else {
            config = new FlakeIdGeneratorConfig_1.FlakeIdGeneratorConfig();
        }
        config.name = name;
        return config;
    };
    ClientConfig.prototype.lookupByPattern = function (config, name) {
        if (config[name] != null) {
            return config[name];
        }
        var matchingPattern = this.configPatternMatcher.matches(Object.keys(config), name);
        if (matchingPattern != null) {
            return config[matchingPattern];
        }
        if (config.default != null) {
            return config.default;
        }
        return null;
    };
    return ClientConfig;
}());
exports.ClientConfig = ClientConfig;
//# sourceMappingURL=Config.js.map