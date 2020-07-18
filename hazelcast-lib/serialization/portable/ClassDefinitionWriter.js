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
var ClassDefinitionBuilder_1 = require("./ClassDefinitionBuilder");
var HazelcastError_1 = require("../../HazelcastError");
var ClassDefinitionWriter = /** @class */ (function () {
    function ClassDefinitionWriter(context, builder) {
        this.context = context;
        this.builder = builder;
    }
    ClassDefinitionWriter.prototype.writeInt = function (fieldName, value) {
        this.builder.addIntField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeLong = function (fieldName, long) {
        this.builder.addLongField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeUTF = function (fieldName, str) {
        this.builder.addUTFField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeBoolean = function (fieldName, value) {
        this.builder.addBooleanField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeByte = function (fieldName, value) {
        this.builder.addByteField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeChar = function (fieldName, char) {
        this.builder.addCharField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeDouble = function (fieldName, double) {
        this.builder.addDoubleField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeFloat = function (fieldName, float) {
        this.builder.addFloatField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeShort = function (fieldName, value) {
        this.builder.addShortField(fieldName);
    };
    ClassDefinitionWriter.prototype.writePortable = function (fieldName, portable) {
        if (portable == null) {
            throw new HazelcastError_1.HazelcastSerializationError('Cannot write null portable without explicitly '
                + 'registering class definition!');
        }
        var version = this.context.getClassVersion(portable);
        var nestedClassDef = this.createNestedClassDef(portable, new ClassDefinitionBuilder_1.ClassDefinitionBuilder(portable.getFactoryId(), portable.getClassId(), version));
        this.builder.addPortableField(fieldName, nestedClassDef);
    };
    ClassDefinitionWriter.prototype.writeNullPortable = function (fieldName, factoryId, classId) {
        var nestedClassDef = this.context.lookupClassDefinition(factoryId, classId, this.context.getVersion());
        if (nestedClassDef == null) {
            throw new HazelcastError_1.HazelcastSerializationError('Cannot write null portable without explicitly '
                + 'registering class definition!');
        }
        this.builder.addPortableField(fieldName, nestedClassDef);
    };
    ClassDefinitionWriter.prototype.writeByteArray = function (fieldName, bytes) {
        this.builder.addByteArrayField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeBooleanArray = function (fieldName, booleans) {
        this.builder.addBooleanArrayField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeCharArray = function (fieldName, chars) {
        this.builder.addCharArrayField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeIntArray = function (fieldName, ints) {
        this.builder.addIntArrayField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeLongArray = function (fieldName, longs) {
        this.builder.addLongArrayField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeDoubleArray = function (fieldName, doubles) {
        this.builder.addDoubleArrayField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeFloatArray = function (fieldName, floats) {
        this.builder.addFloatArrayField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeShortArray = function (fieldName, shorts) {
        this.builder.addShortArrayField(fieldName);
    };
    ClassDefinitionWriter.prototype.writeUTFArray = function (fieldName, val) {
        this.builder.addUTFArrayField(fieldName);
    };
    ClassDefinitionWriter.prototype.writePortableArray = function (fieldName, portables) {
        if (portables == null || portables.length === 0) {
            throw new HazelcastError_1.HazelcastSerializationError('Cannot write null portable array without explicitly '
                + 'registering class definition!');
        }
        var p = portables[0];
        var classId = p.getClassId();
        for (var i = 1; i < portables.length; i++) {
            if (portables[i].getClassId() !== classId) {
                throw new RangeError('Detected different class-ids in portable array!');
            }
        }
        var version = this.context.getClassVersion(p);
        var nestedClassDef = this.createNestedClassDef(p, new ClassDefinitionBuilder_1.ClassDefinitionBuilder(p.getFactoryId(), p.getClassId(), version));
        this.builder.addPortableArrayField(fieldName, nestedClassDef);
    };
    ClassDefinitionWriter.prototype.registerAndGet = function () {
        var cd = this.builder.build();
        return this.context.registerClassDefinition(cd);
    };
    ClassDefinitionWriter.prototype.createNestedClassDef = function (portable, nestedBuilder) {
        var writer = new ClassDefinitionWriter(this.context, nestedBuilder);
        portable.writePortable(writer);
        return this.context.registerClassDefinition(nestedBuilder.build());
    };
    return ClassDefinitionWriter;
}());
exports.ClassDefinitionWriter = ClassDefinitionWriter;
//# sourceMappingURL=ClassDefinitionWriter.js.map