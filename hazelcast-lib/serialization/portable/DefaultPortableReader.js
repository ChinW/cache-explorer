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
var BitsUtil_1 = require("../../BitsUtil");
var HazelcastError_1 = require("../../HazelcastError");
var ClassDefinition_1 = require("./ClassDefinition");
var DefaultPortableReader = /** @class */ (function () {
    function DefaultPortableReader(serializer, input, classDefinition) {
        this.raw = false;
        this.serializer = serializer;
        this.input = input;
        this.classDefinition = classDefinition;
        this.finalPos = this.input.readInt();
        var fieldCount = this.input.readInt();
        this.offset = this.input.position();
    }
    DefaultPortableReader.prototype.getVersion = function () {
        return this.classDefinition.getVersion();
    };
    DefaultPortableReader.prototype.hasField = function (fieldName) {
        return this.classDefinition.hasField(fieldName);
    };
    DefaultPortableReader.prototype.getFieldNames = function () {
        throw new ReferenceError('Not implemented!');
    };
    DefaultPortableReader.prototype.getFieldType = function (fieldName) {
        return this.classDefinition.getFieldType(fieldName);
    };
    DefaultPortableReader.prototype.readInt = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.INT);
        return this.input.readInt(pos);
    };
    DefaultPortableReader.prototype.readLong = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.LONG);
        return this.input.readLong(pos);
    };
    DefaultPortableReader.prototype.readUTF = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.UTF);
        return this.input.readUTF(pos);
    };
    DefaultPortableReader.prototype.readBoolean = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.BOOLEAN);
        return this.input.readBoolean(pos);
    };
    DefaultPortableReader.prototype.readByte = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.BYTE);
        return this.input.readByte(pos);
    };
    DefaultPortableReader.prototype.readChar = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.CHAR);
        return this.input.readChar(pos);
    };
    DefaultPortableReader.prototype.readDouble = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.DOUBLE);
        return this.input.readDouble(pos);
    };
    DefaultPortableReader.prototype.readFloat = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.FLOAT);
        return this.input.readFloat(pos);
    };
    DefaultPortableReader.prototype.readShort = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.SHORT);
        return this.input.readShort(pos);
    };
    DefaultPortableReader.prototype.readPortable = function (fieldName) {
        var backupPos = this.input.position();
        try {
            var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.PORTABLE);
            this.input.position(pos);
            var isNull = this.input.readBoolean();
            var factoryId = this.input.readInt();
            var classId = this.input.readInt();
            if (isNull) {
                return null;
            }
            else {
                return this.serializer.readObject(this.input, factoryId, classId);
            }
        }
        finally {
            this.input.position(backupPos);
        }
    };
    DefaultPortableReader.prototype.readByteArray = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.BYTE_ARRAY);
        return this.input.readByteArray(pos);
    };
    DefaultPortableReader.prototype.readBooleanArray = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.BOOLEAN_ARRAY);
        return this.input.readBooleanArray(pos);
    };
    DefaultPortableReader.prototype.readCharArray = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.CHAR_ARRAY);
        return this.input.readCharArray(pos);
    };
    DefaultPortableReader.prototype.readIntArray = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.INT_ARRAY);
        return this.input.readIntArray(pos);
    };
    DefaultPortableReader.prototype.readLongArray = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.LONG_ARRAY);
        return this.input.readLongArray(pos);
    };
    DefaultPortableReader.prototype.readDoubleArray = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.DOUBLE_ARRAY);
        return this.input.readDoubleArray(pos);
    };
    DefaultPortableReader.prototype.readFloatArray = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.FLOAT_ARRAY);
        return this.input.readFloatArray(pos);
    };
    DefaultPortableReader.prototype.readShortArray = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.SHORT_ARRAY);
        return this.input.readShortArray(pos);
    };
    DefaultPortableReader.prototype.readUTFArray = function (fieldName) {
        var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.UTF_ARRAY);
        return this.input.readUTFArray(pos);
    };
    DefaultPortableReader.prototype.readPortableArray = function (fieldName) {
        var backupPos = this.input.position();
        try {
            var pos = this.positionByField(fieldName, ClassDefinition_1.FieldType.PORTABLE_ARRAY);
            this.input.position(pos);
            var len = this.input.readInt();
            var factoryId = this.input.readInt();
            var classId = this.input.readInt();
            if (len === BitsUtil_1.BitsUtil.NULL_ARRAY_LENGTH) {
                return null;
            }
            else {
                var portables = [];
                if (len > 0) {
                    var offset = this.input.position();
                    for (var i = 0; i < len; i++) {
                        var start = this.input.readInt(offset + i * BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES);
                        this.input.position(start);
                        portables[i] = this.serializer.readObject(this.input, factoryId, classId);
                    }
                }
                return portables;
            }
        }
        finally {
            this.input.position(backupPos);
        }
    };
    DefaultPortableReader.prototype.getRawDataInput = function () {
        var pos;
        if (!this.raw) {
            pos = this.input.readInt(this.offset + this.classDefinition.getFieldCount() * BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES);
            this.input.position(pos);
            this.raw = true;
        }
        return this.input;
    };
    DefaultPortableReader.prototype.end = function () {
        this.input.position(this.finalPos);
    };
    DefaultPortableReader.prototype.positionByFieldDefinition = function (field) {
        if (this.raw) {
            throw new HazelcastError_1.IllegalStateError('Cannot read portable fields after getRawDataInput called!');
        }
        var pos = this.input.readInt(this.offset + field.getIndex() * BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES);
        var len = this.input.readShort(pos);
        return pos + BitsUtil_1.BitsUtil.SHORT_SIZE_IN_BYTES + len + 1;
    };
    DefaultPortableReader.prototype.positionByField = function (fieldName, fieldType) {
        var definition = this.classDefinition.getField(fieldName);
        return this.positionByFieldDefinition(definition);
    };
    return DefaultPortableReader;
}());
exports.DefaultPortableReader = DefaultPortableReader;
//# sourceMappingURL=DefaultPortableReader.js.map