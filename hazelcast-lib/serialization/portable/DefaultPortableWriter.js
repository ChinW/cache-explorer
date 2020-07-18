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
var ClassDefinition_1 = require("./ClassDefinition");
var BitsUtil_1 = require("../../BitsUtil");
var DefaultPortableWriter = /** @class */ (function () {
    function DefaultPortableWriter(serializer, output, classDefinition) {
        this.serializer = serializer;
        this.output = output;
        this.classDefinition = classDefinition;
        this.begin = this.output.position();
        this.output.writeZeroBytes(4);
        this.output.writeInt(this.classDefinition.getFieldCount());
        this.offset = this.output.position();
        var fieldIndexesLength = (this.classDefinition.getFieldCount() + 1) * BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
        this.output.writeZeroBytes(fieldIndexesLength);
    }
    DefaultPortableWriter.prototype.writeInt = function (fieldName, value) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.INT);
        this.output.writeInt(value);
    };
    DefaultPortableWriter.prototype.writeLong = function (fieldName, long) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.LONG);
        this.output.writeLong(long);
    };
    DefaultPortableWriter.prototype.writeUTF = function (fieldName, str) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.UTF);
        this.output.writeUTF(str);
    };
    DefaultPortableWriter.prototype.writeBoolean = function (fieldName, value) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.BOOLEAN);
        this.output.writeBoolean(value);
    };
    DefaultPortableWriter.prototype.writeByte = function (fieldName, value) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.BYTE);
        this.output.writeByte(value);
    };
    DefaultPortableWriter.prototype.writeChar = function (fieldName, char) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.CHAR);
        this.output.writeChar(char);
    };
    DefaultPortableWriter.prototype.writeDouble = function (fieldName, double) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.DOUBLE);
        this.output.writeDouble(double);
    };
    DefaultPortableWriter.prototype.writeFloat = function (fieldName, float) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.FLOAT);
        this.output.writeFloat(float);
    };
    DefaultPortableWriter.prototype.writeShort = function (fieldName, value) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.SHORT);
        this.output.writeShort(value);
    };
    DefaultPortableWriter.prototype.writePortable = function (fieldName, portable) {
        var fieldDefinition = this.setPosition(fieldName, ClassDefinition_1.FieldType.PORTABLE);
        var isNullPortable = (portable == null);
        this.output.writeBoolean(isNullPortable);
        this.output.writeInt(fieldDefinition.getFactoryId());
        this.output.writeInt(fieldDefinition.getClassId());
        if (!isNullPortable) {
            this.serializer.writeObject(this.output, portable);
        }
    };
    DefaultPortableWriter.prototype.writeNullPortable = function (fieldName, factoryId, classId) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.PORTABLE);
        this.output.writeBoolean(true);
        this.output.writeInt(factoryId);
        this.output.writeInt(classId);
    };
    DefaultPortableWriter.prototype.writeByteArray = function (fieldName, bytes) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.BYTE_ARRAY);
        this.output.writeByteArray(bytes);
    };
    DefaultPortableWriter.prototype.writeBooleanArray = function (fieldName, booleans) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.BOOLEAN_ARRAY);
        this.output.writeBooleanArray(booleans);
    };
    DefaultPortableWriter.prototype.writeCharArray = function (fieldName, chars) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.CHAR_ARRAY);
        this.output.writeCharArray(chars);
    };
    DefaultPortableWriter.prototype.writeIntArray = function (fieldName, ints) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.INT_ARRAY);
        this.output.writeIntArray(ints);
    };
    DefaultPortableWriter.prototype.writeLongArray = function (fieldName, longs) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.LONG_ARRAY);
        this.output.writeLongArray(longs);
    };
    DefaultPortableWriter.prototype.writeDoubleArray = function (fieldName, doubles) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.DOUBLE_ARRAY);
        this.output.writeDoubleArray(doubles);
    };
    DefaultPortableWriter.prototype.writeFloatArray = function (fieldName, floats) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.FLOAT_ARRAY);
        this.output.writeFloatArray(floats);
    };
    DefaultPortableWriter.prototype.writeShortArray = function (fieldName, shorts) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.SHORT_ARRAY);
        this.output.writeShortArray(shorts);
    };
    DefaultPortableWriter.prototype.writeUTFArray = function (fieldName, val) {
        this.setPosition(fieldName, ClassDefinition_1.FieldType.UTF_ARRAY);
        this.output.writeUTFArray(val);
    };
    DefaultPortableWriter.prototype.writePortableArray = function (fieldName, portables) {
        var innerOffset;
        var sample;
        var i;
        var fieldDefinition = this.setPosition(fieldName, ClassDefinition_1.FieldType.PORTABLE_ARRAY);
        var len = (portables == null) ? BitsUtil_1.BitsUtil.NULL_ARRAY_LENGTH : portables.length;
        this.output.writeInt(len);
        this.output.writeInt(fieldDefinition.getFactoryId());
        this.output.writeInt(fieldDefinition.getClassId());
        if (len > 0) {
            innerOffset = this.output.position();
            this.output.writeZeroBytes(len * 4);
            for (i = 0; i < len; i++) {
                sample = portables[i];
                var posVal = this.output.position();
                this.output.pwriteInt(innerOffset + i * BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES, posVal);
                this.serializer.writeObject(this.output, sample);
            }
        }
    };
    DefaultPortableWriter.prototype.end = function () {
        var position = this.output.position();
        this.output.pwriteInt(this.begin, position);
    };
    DefaultPortableWriter.prototype.setPosition = function (fieldName, fieldType) {
        var field = this.classDefinition.getField(fieldName);
        var pos = this.output.position();
        var index = field.getIndex();
        this.output.pwriteInt(this.offset + index * BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES, pos);
        this.output.writeShort(fieldName.length);
        this.output.writeBytes(fieldName);
        this.output.writeByte(fieldType);
        return field;
    };
    return DefaultPortableWriter;
}());
exports.DefaultPortableWriter = DefaultPortableWriter;
//# sourceMappingURL=DefaultPortableWriter.js.map