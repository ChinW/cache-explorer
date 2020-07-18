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
var HazelcastError_1 = require("../../HazelcastError");
var ClassDefinitionBuilder = /** @class */ (function () {
    function ClassDefinitionBuilder(factoryId, classId, version) {
        if (version === void 0) { version = 0; }
        this.fieldDefinitions = [];
        this.index = 0;
        this.factoryId = factoryId;
        this.classId = classId;
        this.version = version;
    }
    ClassDefinitionBuilder.prototype.getFactoryId = function () {
        return this.factoryId;
    };
    ClassDefinitionBuilder.prototype.getClassId = function () {
        return this.classId;
    };
    ClassDefinitionBuilder.prototype.getVersion = function () {
        return this.version;
    };
    ClassDefinitionBuilder.prototype.addByteField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.BYTE, this.version));
    };
    ClassDefinitionBuilder.prototype.addBooleanField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.BOOLEAN, this.version));
    };
    ClassDefinitionBuilder.prototype.addCharField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.CHAR, this.version));
    };
    ClassDefinitionBuilder.prototype.addShortField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.SHORT, this.version));
    };
    ClassDefinitionBuilder.prototype.addIntField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.INT, this.version));
    };
    ClassDefinitionBuilder.prototype.addLongField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.LONG, this.version));
    };
    ClassDefinitionBuilder.prototype.addFloatField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.FLOAT, this.version));
    };
    ClassDefinitionBuilder.prototype.addDoubleField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.DOUBLE, this.version));
    };
    ClassDefinitionBuilder.prototype.addUTFField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.UTF, this.version));
    };
    ClassDefinitionBuilder.prototype.addPortableField = function (fieldName, def) {
        if (def.getClassId() === 0) {
            throw new RangeError('Portable class ID cannot be zero!');
        }
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.PORTABLE, def.getVersion(), def.getFactoryId(), def.getClassId()));
    };
    ClassDefinitionBuilder.prototype.addByteArrayField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.BYTE_ARRAY, this.version));
    };
    ClassDefinitionBuilder.prototype.addBooleanArrayField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.BOOLEAN_ARRAY, this.version));
    };
    ClassDefinitionBuilder.prototype.addCharArrayField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.CHAR_ARRAY, this.version));
    };
    ClassDefinitionBuilder.prototype.addShortArrayField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.SHORT_ARRAY, this.version));
    };
    ClassDefinitionBuilder.prototype.addIntArrayField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.INT_ARRAY, this.version));
    };
    ClassDefinitionBuilder.prototype.addLongArrayField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.LONG_ARRAY, this.version));
    };
    ClassDefinitionBuilder.prototype.addFloatArrayField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.FLOAT_ARRAY, this.version));
    };
    ClassDefinitionBuilder.prototype.addDoubleArrayField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.DOUBLE_ARRAY, this.version));
    };
    ClassDefinitionBuilder.prototype.addUTFArrayField = function (fieldName) {
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.UTF_ARRAY, this.version));
    };
    ClassDefinitionBuilder.prototype.addPortableArrayField = function (fieldName, def) {
        if (def.getClassId() === 0) {
            throw new RangeError('Portable class ID cannot be zero!');
        }
        return this.addField(new ClassDefinition_1.FieldDefinition(this.index, fieldName, ClassDefinition_1.FieldType.PORTABLE_ARRAY, def.getVersion(), def.getFactoryId(), def.getClassId()));
    };
    ClassDefinitionBuilder.prototype.addField = function (fieldDefinition) {
        if (this.done) {
            throw new HazelcastError_1.HazelcastSerializationError("ClassDefinition is already built for " + this.classId);
        }
        if (this.index !== fieldDefinition.getIndex()) {
            throw new RangeError('Invalid field index');
        }
        this.fieldDefinitions.push(fieldDefinition);
        this.index++;
        return this;
    };
    ClassDefinitionBuilder.prototype.build = function () {
        this.done = true;
        var cd = new ClassDefinition_1.ClassDefinition(this.factoryId, this.classId, this.version);
        for (var _i = 0, _a = this.fieldDefinitions; _i < _a.length; _i++) {
            var fd = _a[_i];
            cd.addFieldDefinition(fd);
        }
        return cd;
    };
    return ClassDefinitionBuilder;
}());
exports.ClassDefinitionBuilder = ClassDefinitionBuilder;
//# sourceMappingURL=ClassDefinitionBuilder.js.map