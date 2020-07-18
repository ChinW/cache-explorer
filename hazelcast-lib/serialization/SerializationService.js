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
var AggregatorFactory_1 = require("../aggregation/AggregatorFactory");
var ClusterDataFactory_1 = require("../ClusterDataFactory");
var ClusterDataFactoryHelper_1 = require("../ClusterDataFactoryHelper");
var ReliableTopicMessage_1 = require("../proxy/topic/ReliableTopicMessage");
var Util = require("../Util");
var DefaultPredicates = require("./DefaultPredicates");
var DefaultSerializer_1 = require("./DefaultSerializer");
var HeapData_1 = require("./HeapData");
var ObjectData_1 = require("./ObjectData");
var PortableSerializer_1 = require("./portable/PortableSerializer");
var PredicateFactory_1 = require("./PredicateFactory");
var JsonStringDeserializationPolicy_1 = require("../config/JsonStringDeserializationPolicy");
var RestValue_1 = require("../core/RestValue");
var SerializationServiceV1 = /** @class */ (function () {
    function SerializationServiceV1(client, serializationConfig) {
        this.client = client;
        this.serializationConfig = serializationConfig;
        this.registry = {};
        this.serializerNameToId = {};
        this.registerDefaultSerializers();
        this.registerCustomSerializers();
        this.registerGlobalSerializer();
    }
    SerializationServiceV1.prototype.isData = function (object) {
        if (object instanceof HeapData_1.HeapData) {
            return true;
        }
        else {
            return false;
        }
    };
    SerializationServiceV1.prototype.toData = function (object, partitioningStrategy) {
        if (partitioningStrategy === void 0) { partitioningStrategy = this.defaultPartitionStrategy; }
        if (this.isData(object)) {
            return object;
        }
        var dataOutput = new ObjectData_1.PositionalObjectDataOutput(this, this.serializationConfig.isBigEndian);
        var serializer = this.findSerializerFor(object);
        // Check if object is partition aware
        if (object != null && object.getPartitionKey) {
            var partitionKey = object.getPartitionKey();
            var serializedPartitionKey = this.toData(partitionKey);
            dataOutput.writeIntBE(this.calculatePartitionHash(serializedPartitionKey, partitioningStrategy));
        }
        else {
            dataOutput.writeIntBE(this.calculatePartitionHash(object, partitioningStrategy));
        }
        dataOutput.writeIntBE(serializer.getId());
        serializer.write(dataOutput, object);
        return new HeapData_1.HeapData(dataOutput.toBuffer());
    };
    SerializationServiceV1.prototype.toObject = function (data) {
        if (data == null) {
            return data;
        }
        if (!data.getType) {
            return data;
        }
        var serializer = this.findSerializerById(data.getType());
        var dataInput = new ObjectData_1.ObjectDataInput(data.toBuffer(), HeapData_1.DATA_OFFSET, this, this.serializationConfig.isBigEndian);
        return serializer.read(dataInput);
    };
    SerializationServiceV1.prototype.writeObject = function (out, object) {
        var serializer = this.findSerializerFor(object);
        out.writeInt(serializer.getId());
        serializer.write(out, object);
    };
    SerializationServiceV1.prototype.readObject = function (inp) {
        var serializerId = inp.readInt();
        var serializer = this.findSerializerById(serializerId);
        return serializer.read(inp);
    };
    SerializationServiceV1.prototype.registerSerializer = function (name, serializer) {
        if (this.serializerNameToId[name]) {
            throw new RangeError('Given serializer name is already in the registry.');
        }
        if (this.registry[serializer.getId()]) {
            throw new RangeError('Given serializer id is already in the registry.');
        }
        this.serializerNameToId[name] = serializer.getId();
        this.registry[serializer.getId()] = serializer;
    };
    /**
     * Serialization precedence
     *  1. NULL
     *  2. DataSerializable
     *  3. Portable
     *  4. Default Types
     *      * Byte, Boolean, Character, Short, Integer, Long, Float, Double, String
     *      * Array of [Byte, Boolean, Character, Short, Integer, Long, Float, Double, String]
     *      * Java types [Date, BigInteger, BigDecimal, Class, Enum]
     *  5. Custom serializers
     *  6. Global Serializer
     *  7. Fallback (JSON)
     * @param obj
     * @returns
     */
    SerializationServiceV1.prototype.findSerializerFor = function (obj) {
        if (obj === undefined) {
            throw new RangeError('undefined cannot be serialized.');
        }
        var serializer = null;
        if (obj === null) {
            serializer = this.findSerializerByName('null', false);
        }
        if (serializer === null) {
            serializer = this.lookupDefaultSerializer(obj);
        }
        if (serializer === null) {
            serializer = this.lookupCustomSerializer(obj);
        }
        if (serializer === null) {
            serializer = this.lookupGlobalSerializer();
        }
        if (serializer === null) {
            serializer = this.findSerializerByName('!json', false);
        }
        if (serializer === null) {
            throw new RangeError('There is no suitable serializer for ' + obj + '.');
        }
        return serializer;
    };
    SerializationServiceV1.prototype.lookupDefaultSerializer = function (obj) {
        var serializer = null;
        if (this.isIdentifiedDataSerializable(obj)) {
            return this.findSerializerByName('identified', false);
        }
        if (this.isPortableSerializable(obj)) {
            return this.findSerializerByName('!portable', false);
        }
        var objectType = Util.getType(obj);
        if (objectType === 'array') {
            if (obj.length === 0) {
                serializer = this.findSerializerByName('number', true);
            }
            else {
                serializer = this.findSerializerByName(Util.getType(obj[0]), true);
            }
        }
        else {
            serializer = this.findSerializerByName(objectType, false);
        }
        return serializer;
    };
    SerializationServiceV1.prototype.lookupCustomSerializer = function (obj) {
        if (this.isCustomSerializable(obj)) {
            return this.findSerializerById(obj.hzGetCustomId());
        }
        return null;
    };
    SerializationServiceV1.prototype.lookupGlobalSerializer = function () {
        return this.findSerializerByName('!global', false);
    };
    SerializationServiceV1.prototype.isIdentifiedDataSerializable = function (obj) {
        return (obj.readData && obj.writeData && obj.getClassId && obj.getFactoryId);
    };
    SerializationServiceV1.prototype.isPortableSerializable = function (obj) {
        return (obj.readPortable && obj.writePortable && obj.getFactoryId && obj.getClassId);
    };
    SerializationServiceV1.prototype.registerDefaultSerializers = function () {
        this.registerSerializer('string', new DefaultSerializer_1.StringSerializer());
        this.registerSerializer('double', new DefaultSerializer_1.DoubleSerializer());
        this.registerSerializer('byte', new DefaultSerializer_1.ByteSerializer());
        this.registerSerializer('boolean', new DefaultSerializer_1.BooleanSerializer());
        this.registerSerializer('null', new DefaultSerializer_1.NullSerializer());
        this.registerSerializer('short', new DefaultSerializer_1.ShortSerializer());
        this.registerSerializer('integer', new DefaultSerializer_1.IntegerSerializer());
        this.registerSerializer('long', new DefaultSerializer_1.LongSerializer());
        this.registerSerializer('float', new DefaultSerializer_1.FloatSerializer());
        this.registerSerializer('char', new DefaultSerializer_1.CharSerializer());
        this.registerSerializer('date', new DefaultSerializer_1.DateSerializer());
        this.registerSerializer('byteArray', new DefaultSerializer_1.ByteArraySerializer());
        this.registerSerializer('charArray', new DefaultSerializer_1.CharArraySerializer());
        this.registerSerializer('booleanArray', new DefaultSerializer_1.BooleanArraySerializer());
        this.registerSerializer('shortArray', new DefaultSerializer_1.ShortArraySerializer());
        this.registerSerializer('integerArray', new DefaultSerializer_1.IntegerArraySerializer());
        this.registerSerializer('longArray', new DefaultSerializer_1.LongArraySerializer());
        this.registerSerializer('doubleArray', new DefaultSerializer_1.DoubleArraySerializer());
        this.registerSerializer('stringArray', new DefaultSerializer_1.StringArraySerializer());
        this.registerSerializer('javaClass', new DefaultSerializer_1.JavaClassSerializer());
        this.registerSerializer('floatArray', new DefaultSerializer_1.FloatArraySerializer());
        this.registerIdentifiedFactories();
        this.registerSerializer('!portable', new PortableSerializer_1.PortableSerializer(this, this.serializationConfig));
        if (this.serializationConfig.jsonStringDeserializationPolicy === JsonStringDeserializationPolicy_1.JsonStringDeserializationPolicy.EAGER) {
            this.registerSerializer('!json', new DefaultSerializer_1.JsonSerializer());
        }
        else {
            this.registerSerializer('!json', new DefaultSerializer_1.HazelcastJsonValueSerializer());
        }
    };
    SerializationServiceV1.prototype.registerIdentifiedFactories = function () {
        var factories = {};
        for (var id in this.serializationConfig.dataSerializableFactories) {
            factories[id] = this.serializationConfig.dataSerializableFactories[id];
        }
        var factoryConfigs = this.serializationConfig.dataSerializableFactoryConfigs;
        for (var id in factoryConfigs) {
            var path = factoryConfigs[id].path;
            var exportedName = factoryConfigs[id].exportedName;
            var factoryConstructor = Util.loadNameFromPath(path, exportedName);
            factories[id] = new factoryConstructor();
        }
        factories[PredicateFactory_1.PREDICATE_FACTORY_ID] = new PredicateFactory_1.PredicateFactory(DefaultPredicates);
        factories[ReliableTopicMessage_1.RELIABLE_TOPIC_MESSAGE_FACTORY_ID] = new ReliableTopicMessage_1.ReliableTopicMessageFactory();
        factories[ClusterDataFactoryHelper_1.ClusterDataFactoryHelper.FACTORY_ID] = new ClusterDataFactory_1.ClusterDataFactory();
        factories[AggregatorFactory_1.AggregatorFactory.FACTORY_ID] = new AggregatorFactory_1.AggregatorFactory();
        factories[RestValue_1.REST_VALUE_FACTORY_ID] = new RestValue_1.RestValueFactory();
        this.registerSerializer('identified', new DefaultSerializer_1.IdentifiedDataSerializableSerializer(factories));
    };
    SerializationServiceV1.prototype.registerCustomSerializers = function () {
        var customSerializersArray = this.serializationConfig.customSerializers;
        var self = this;
        customSerializersArray.forEach(function (candidate) {
            self.assertValidCustomSerializer(candidate);
            self.registerSerializer('!custom' + candidate.getId(), candidate);
        });
        var customSerializerConfigs = this.serializationConfig.customSerializerConfigs;
        for (var typeId in customSerializerConfigs) {
            var serializerConfig = customSerializerConfigs[typeId];
            var customSerializer = new (Util.loadNameFromPath(serializerConfig.path, serializerConfig.exportedName))();
            this.registerSerializer('!custom' + typeId, customSerializer);
        }
    };
    SerializationServiceV1.prototype.registerGlobalSerializer = function () {
        var candidate = null;
        if (this.serializationConfig.globalSerializerConfig != null) {
            var exportedName = this.serializationConfig.globalSerializerConfig.exportedName;
            var path = this.serializationConfig.globalSerializerConfig.path;
            var serializerFactory = Util.loadNameFromPath(path, exportedName);
            candidate = new serializerFactory();
        }
        if (candidate == null) {
            candidate = this.serializationConfig.globalSerializer;
        }
        if (candidate == null) {
            return;
        }
        this.assertValidCustomSerializer(candidate);
        this.registerSerializer('!global', candidate);
    };
    SerializationServiceV1.prototype.assertValidCustomSerializer = function (candidate) {
        var fGetId = 'getId';
        var fRead = 'read';
        var fWrite = 'write';
        if (typeof candidate[fGetId] !== 'function' ||
            typeof candidate[fRead] !== 'function' ||
            typeof candidate[fWrite] !== 'function') {
            throw new TypeError('Custom serializer should have ' + fGetId + ', ' + fRead + ' and ' + fWrite + ' methods.');
        }
        var typeId = candidate[fGetId]();
        if (!Number.isInteger(typeId) || typeId < 1) {
            throw new TypeError('Custom serializer should have its typeId greater than or equal to 1.');
        }
    };
    SerializationServiceV1.prototype.isCustomSerializable = function (object) {
        var prop = 'hzGetCustomId';
        return (object[prop] && typeof object[prop] === 'function' && object[prop]() >= 1);
    };
    SerializationServiceV1.prototype.findSerializerByName = function (name, isArray) {
        var convertedName;
        if (name === 'number') {
            convertedName = this.serializationConfig.defaultNumberType;
        }
        else {
            convertedName = name;
        }
        var serializerName = convertedName + (isArray ? 'Array' : '');
        var serializerId = this.serializerNameToId[serializerName];
        if (serializerId == null) {
            return null;
        }
        return this.findSerializerById(serializerId);
    };
    SerializationServiceV1.prototype.findSerializerById = function (id) {
        var serializer = this.registry[id];
        return serializer;
    };
    SerializationServiceV1.prototype.calculatePartitionHash = function (object, strategy) {
        return strategy(object);
    };
    SerializationServiceV1.prototype.defaultPartitionStrategy = function (obj) {
        /* tslint:disable:no-string-literal */
        if (obj == null || !obj['getPartitionHash']) {
            /* tslint:enable:no-string-literal */
            return 0;
        }
        else {
            return obj.getPartitionHash();
        }
    };
    return SerializationServiceV1;
}());
exports.SerializationServiceV1 = SerializationServiceV1;
//# sourceMappingURL=SerializationService.js.map