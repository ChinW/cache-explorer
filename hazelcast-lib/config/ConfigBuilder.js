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
var BasicSSLOptionsFactory_1 = require("../connection/BasicSSLOptionsFactory");
var HazelcastError_1 = require("../HazelcastError");
var TopicOverloadPolicy_1 = require("../proxy/topic/TopicOverloadPolicy");
var Util_1 = require("../Util");
var Config_1 = require("./Config");
var EvictionPolicy_1 = require("./EvictionPolicy");
var FlakeIdGeneratorConfig_1 = require("./FlakeIdGeneratorConfig");
var InMemoryFormat_1 = require("./InMemoryFormat");
var JsonConfigLocator_1 = require("./JsonConfigLocator");
var NearCacheConfig_1 = require("./NearCacheConfig");
var ReliableTopicConfig_1 = require("./ReliableTopicConfig");
var JsonStringDeserializationPolicy_1 = require("./JsonStringDeserializationPolicy");
var ConnectionStrategyConfig_1 = require("./ConnectionStrategyConfig");
var RandomLB_1 = require("../util/RandomLB");
var RoundRobinLB_1 = require("../util/RoundRobinLB");
var ConfigBuilder = /** @class */ (function () {
    function ConfigBuilder() {
        this.clientConfig = new Config_1.ClientConfig();
        this.configLocator = new JsonConfigLocator_1.JsonConfigLocator();
    }
    ConfigBuilder.prototype.loadConfig = function () {
        var _this = this;
        return this.configLocator.load().then(function () {
            var loadedBuffer = _this.configLocator.getBuffer();
            if (loadedBuffer) {
                _this.loadedJson = JSON.parse(loadedBuffer.toString());
                return _this.replaceImportsWithContent(_this.loadedJson);
            }
        });
    };
    ConfigBuilder.prototype.build = function () {
        try {
            this.handleConfig(this.loadedJson);
            return this.clientConfig;
        }
        catch (e) {
            throw new HazelcastError_1.HazelcastError('Error parsing config: ' + e.message, e);
        }
    };
    ConfigBuilder.prototype.replaceImportsWithContent = function (jsonObject) {
        var _this = this;
        if (jsonObject.import) {
            var includes = Util_1.tryGetArray(jsonObject.import);
            return Promise.map(includes, function (path) {
                return _this.configLocator.loadImported(path);
            }).map(function (buffer) {
                Util_1.mergeJson(jsonObject, JSON.parse(buffer.toString()));
            }).then(function () { return undefined; });
        }
    };
    ConfigBuilder.prototype.handleConfig = function (jsonObject) {
        for (var key in jsonObject) {
            var value = jsonObject[key];
            if (key === 'clusterName') {
                this.clientConfig.clusterName = Util_1.tryGetString(value);
            }
            else if (key === 'instanceName') {
                this.clientConfig.instanceName = Util_1.tryGetString(value);
            }
            else if (key === 'properties') {
                this.handleProperties(value);
            }
            else if (key === 'clientLabels') {
                this.handleClientLabels(value);
            }
            else if (key === 'network') {
                this.handleNetwork(value);
            }
            else if (key === 'connectionStrategy') {
                this.handleConnectionStrategy(value);
            }
            else if (key === 'listeners') {
                this.handleListeners(value);
            }
            else if (key === 'serialization') {
                this.handleSerialization(value);
            }
            else if (key === 'nearCaches') {
                this.handleNearCaches(value);
            }
            else if (key === 'reliableTopics') {
                this.handleReliableTopics(value);
            }
            else if (key === 'flakeIdGeneratorConfigs') {
                this.handleFlakeIds(value);
            }
            else if (key === 'loadBalancer') {
                this.handleLoadBalancer(value);
            }
        }
    };
    ConfigBuilder.prototype.handleConnectionStrategy = function (jsonObject) {
        for (var key in jsonObject) {
            var value = jsonObject[key];
            if (key === 'asyncStart') {
                this.clientConfig.connectionStrategyConfig.asyncStart = Util_1.tryGetBoolean(value);
            }
            else if (key === 'reconnectMode') {
                this.clientConfig.connectionStrategyConfig.reconnectMode = Util_1.tryGetEnum(ConnectionStrategyConfig_1.ReconnectMode, value);
            }
            else if (key === 'connectionRetry') {
                this.handleConnectionRetry(value);
            }
        }
    };
    ConfigBuilder.prototype.handleConnectionRetry = function (jsonObject) {
        for (var key in jsonObject) {
            var value = jsonObject[key];
            if (key === 'initialBackoffMillis') {
                this.clientConfig.connectionStrategyConfig.connectionRetryConfig.initialBackoffMillis = Util_1.tryGetNumber(value);
            }
            else if (key === 'maxBackoffMillis') {
                this.clientConfig.connectionStrategyConfig.connectionRetryConfig.maxBackoffMillis = Util_1.tryGetNumber(value);
            }
            else if (key === 'multiplier') {
                this.clientConfig.connectionStrategyConfig.connectionRetryConfig.multiplier = Util_1.tryGetNumber(value);
            }
            else if (key === 'clusterConnectTimeoutMillis') {
                this.clientConfig.connectionStrategyConfig.connectionRetryConfig
                    .clusterConnectTimeoutMillis = Util_1.tryGetNumber(value);
            }
            else if (key === 'jitter') {
                this.clientConfig.connectionStrategyConfig.connectionRetryConfig.jitter = Util_1.tryGetNumber(value);
            }
        }
    };
    ConfigBuilder.prototype.handleClientLabels = function (jsonObject) {
        var labelsArray = Util_1.tryGetArray(jsonObject);
        for (var index in labelsArray) {
            var label = labelsArray[index];
            this.clientConfig.labels.add(label);
        }
    };
    ConfigBuilder.prototype.handleNetwork = function (jsonObject) {
        for (var key in jsonObject) {
            if (key === 'clusterMembers') {
                this.handleClusterMembers(jsonObject[key]);
            }
            else if (key === 'smartRouting') {
                this.clientConfig.networkConfig.smartRouting = Util_1.tryGetBoolean(jsonObject[key]);
            }
            else if (key === 'connectionTimeout') {
                this.clientConfig.networkConfig.connectionTimeout = Util_1.tryGetNumber(jsonObject[key]);
            }
            else if (key === 'ssl') {
                this.handleSSL(jsonObject[key]);
            }
            else if (key === 'hazelcastCloud') {
                this.handleHazelcastCloud(jsonObject[key]);
            }
        }
    };
    ConfigBuilder.prototype.handleHazelcastCloud = function (jsonObject) {
        var cloudConfigEnabled = Util_1.tryGetBoolean(jsonObject.enabled);
        if (cloudConfigEnabled) {
            this.clientConfig.networkConfig.cloudConfig.enabled = cloudConfigEnabled;
        }
        for (var key in jsonObject) {
            if (key === 'discoveryToken') {
                this.clientConfig.networkConfig.cloudConfig.discoveryToken = Util_1.tryGetString(jsonObject[key]);
            }
        }
    };
    ConfigBuilder.prototype.parseProperties = function (jsonObject) {
        var props = {};
        for (var key in jsonObject) {
            props[key] = jsonObject[key];
        }
        return props;
    };
    ConfigBuilder.prototype.parseImportConfig = function (jsonObject) {
        var importConfig = {};
        importConfig.path = jsonObject.path;
        importConfig.exportedName = jsonObject.exportedName;
        return importConfig;
    };
    ConfigBuilder.prototype.handleSSL = function (jsonObject) {
        var sslEnabled = Util_1.tryGetBoolean(jsonObject.enabled);
        this.clientConfig.networkConfig.sslConfig.enabled = sslEnabled;
        if (jsonObject.sslOptions) {
            if (jsonObject.factory) {
                throw new RangeError('Invalid configuration. Either SSL options should be set manually or SSL factory' +
                    ' should be used.');
            }
            this.clientConfig.networkConfig.sslConfig.sslOptions = jsonObject.sslOptions;
        }
        else if (jsonObject.factory) {
            var factory = jsonObject.factory;
            var importConfig = this.parseImportConfig(factory);
            if (importConfig.path == null && importConfig.exportedName !== BasicSSLOptionsFactory_1.BasicSSLOptionsFactory.name) {
                throw new RangeError('Invalid configuration. Either SSL factory path should be set or exportedName' +
                    ' should be ' + BasicSSLOptionsFactory_1.BasicSSLOptionsFactory.name + '.');
            }
            else {
                this.clientConfig.networkConfig.sslConfig.sslOptionsFactoryConfig = this.parseImportConfig(factory);
                this.clientConfig.networkConfig.sslConfig.sslOptionsFactoryProperties = this.parseProperties(factory.properties);
            }
        }
    };
    ConfigBuilder.prototype.handleClusterMembers = function (jsonObject) {
        var addressArray = Util_1.tryGetArray(jsonObject);
        for (var index in addressArray) {
            var address = addressArray[index];
            this.clientConfig.networkConfig.addresses.push(Util_1.tryGetString(address));
        }
    };
    ConfigBuilder.prototype.handleProperties = function (jsonObject) {
        for (var key in jsonObject) {
            this.clientConfig.properties[key] = jsonObject[key];
        }
    };
    ConfigBuilder.prototype.handleListeners = function (jsonObject) {
        var listenersArray = Util_1.tryGetArray(jsonObject);
        for (var index in listenersArray) {
            var listener = listenersArray[index];
            var listenerConfig = {};
            listenerConfig.importConfig = this.parseImportConfig(listener);
            listenerConfig.type = listener.type;
            this.clientConfig.listenerConfigs.push(listenerConfig);
        }
    };
    ConfigBuilder.prototype.handleSerialization = function (jsonObject) {
        for (var key in jsonObject) {
            if (key === 'defaultNumberType') {
                this.clientConfig.serializationConfig.defaultNumberType = Util_1.tryGetString(jsonObject[key]);
            }
            else if (key === 'isBigEndian') {
                this.clientConfig.serializationConfig.isBigEndian = Util_1.tryGetBoolean(jsonObject[key]);
            }
            else if (key === 'portableVersion') {
                this.clientConfig.serializationConfig.portableVersion = Util_1.tryGetNumber(jsonObject[key]);
            }
            else if (key === 'dataSerializableFactories') {
                for (var index in jsonObject[key]) {
                    var factory = jsonObject[key][index];
                    this.clientConfig.serializationConfig
                        .dataSerializableFactoryConfigs[factory.factoryId] = this.parseImportConfig(factory);
                }
            }
            else if (key === 'portableFactories') {
                for (var index in jsonObject[key]) {
                    var factory = jsonObject[key][index];
                    this.clientConfig.serializationConfig
                        .portableFactoryConfigs[factory.factoryId] = this.parseImportConfig(factory);
                }
            }
            else if (key === 'globalSerializer') {
                var globalSerializer = jsonObject[key];
                this.clientConfig.serializationConfig.globalSerializerConfig = this.parseImportConfig(globalSerializer);
            }
            else if (key === 'serializers') {
                this.handleSerializers(jsonObject[key]);
            }
            else if (key === 'jsonStringDeserializationPolicy') {
                this.clientConfig.serializationConfig
                    .jsonStringDeserializationPolicy = Util_1.tryGetEnum(JsonStringDeserializationPolicy_1.JsonStringDeserializationPolicy, jsonObject[key]);
            }
        }
    };
    ConfigBuilder.prototype.handleSerializers = function (jsonObject) {
        var serializersArray = Util_1.tryGetArray(jsonObject);
        for (var index in serializersArray) {
            var serializer = serializersArray[index];
            this.clientConfig.serializationConfig.customSerializerConfigs[serializer.typeId] = this.parseImportConfig(serializer);
        }
    };
    ConfigBuilder.prototype.handleNearCaches = function (jsonObject) {
        var nearCachesArray = Util_1.tryGetArray(jsonObject);
        for (var index in nearCachesArray) {
            var ncConfig = nearCachesArray[index];
            var nearCacheConfig = new NearCacheConfig_1.NearCacheConfig();
            for (var name in ncConfig) {
                if (name === 'name') {
                    nearCacheConfig.name = Util_1.tryGetString(ncConfig[name]);
                }
                else if (name === 'invalidateOnChange') {
                    nearCacheConfig.invalidateOnChange = Util_1.tryGetBoolean(ncConfig[name]);
                }
                else if (name === 'maxIdleSeconds') {
                    nearCacheConfig.maxIdleSeconds = Util_1.tryGetNumber(ncConfig[name]);
                }
                else if (name === 'inMemoryFormat') {
                    nearCacheConfig.inMemoryFormat = Util_1.tryGetEnum(InMemoryFormat_1.InMemoryFormat, ncConfig[name]);
                }
                else if (name === 'timeToLiveSeconds') {
                    nearCacheConfig.timeToLiveSeconds = Util_1.tryGetNumber(ncConfig[name]);
                }
                else if (name === 'evictionPolicy') {
                    nearCacheConfig.evictionPolicy = Util_1.tryGetEnum(EvictionPolicy_1.EvictionPolicy, ncConfig[name]);
                }
                else if (name === 'evictionMaxSize') {
                    nearCacheConfig.evictionMaxSize = Util_1.tryGetNumber(ncConfig[name]);
                }
                else if (name === 'evictionSamplingCount') {
                    nearCacheConfig.evictionSamplingCount = Util_1.tryGetNumber(ncConfig[name]);
                }
                else if (name === 'evictionSamplingPoolSize') {
                    nearCacheConfig.evictionSamplingPoolSize = Util_1.tryGetNumber(ncConfig[name]);
                }
            }
            this.clientConfig.nearCacheConfigs[nearCacheConfig.name] = nearCacheConfig;
        }
    };
    ConfigBuilder.prototype.handleReliableTopics = function (jsonObject) {
        var rtConfigsArray = Util_1.tryGetArray(jsonObject);
        for (var index in rtConfigsArray) {
            var jsonRtCfg = rtConfigsArray[index];
            var reliableTopicConfig = new ReliableTopicConfig_1.ReliableTopicConfig();
            for (var name in jsonRtCfg) {
                if (name === 'name') {
                    reliableTopicConfig.name = jsonRtCfg[name];
                }
                else if (name === 'readBatchSize') {
                    reliableTopicConfig.readBatchSize = jsonRtCfg[name];
                }
                else if (name === 'overloadPolicy') {
                    reliableTopicConfig.overloadPolicy = Util_1.tryGetEnum(TopicOverloadPolicy_1.TopicOverloadPolicy, jsonRtCfg[name]);
                }
            }
            this.clientConfig.reliableTopicConfigs[reliableTopicConfig.name] = reliableTopicConfig;
        }
    };
    ConfigBuilder.prototype.handleFlakeIds = function (jsonObject) {
        var flakeIdsArray = Util_1.tryGetArray(jsonObject);
        for (var index in flakeIdsArray) {
            var fidConfig = flakeIdsArray[index];
            var flakeIdConfig = new FlakeIdGeneratorConfig_1.FlakeIdGeneratorConfig();
            for (var name in fidConfig) {
                if (name === 'name') {
                    flakeIdConfig.name = Util_1.tryGetString(fidConfig[name]);
                }
                else if (name === 'prefetchCount') {
                    flakeIdConfig.prefetchCount = Util_1.tryGetNumber(fidConfig[name]);
                }
                else if (name === 'prefetchValidityMillis') {
                    flakeIdConfig.prefetchValidityMillis = Util_1.tryGetNumber(fidConfig[name]);
                }
            }
            this.clientConfig.flakeIdGeneratorConfigs[flakeIdConfig.name] = flakeIdConfig;
        }
    };
    ConfigBuilder.prototype.handleLoadBalancer = function (jsonObject) {
        for (var key in jsonObject) {
            if (key === 'type') {
                var loadBalancer = Util_1.tryGetString(jsonObject[key]);
                if (loadBalancer === 'random') {
                    this.clientConfig.loadBalancer = new RandomLB_1.RandomLB();
                }
                else if (loadBalancer === 'roundRobin') {
                    this.clientConfig.loadBalancer = new RoundRobinLB_1.RoundRobinLB();
                }
            }
        }
    };
    return ConfigBuilder;
}());
exports.ConfigBuilder = ConfigBuilder;
//# sourceMappingURL=ConfigBuilder.js.map