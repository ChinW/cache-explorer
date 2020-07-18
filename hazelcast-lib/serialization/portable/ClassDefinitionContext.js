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
var HazelcastError_1 = require("../../HazelcastError");
var ClassDefinitionContext = /** @class */ (function () {
    function ClassDefinitionContext(factoryId) {
        this.factoryId = factoryId;
        this.classDefs = {};
    }
    ClassDefinitionContext.encodeVersionedClassId = function (classId, version) {
        return classId + 'v' + version;
    };
    ClassDefinitionContext.prototype.lookup = function (classId, version) {
        var encoded = ClassDefinitionContext.encodeVersionedClassId(classId, version);
        return this.classDefs[encoded];
    };
    ClassDefinitionContext.prototype.register = function (classDefinition) {
        if (classDefinition === null) {
            return null;
        }
        if (classDefinition.getFactoryId() !== this.factoryId) {
            throw new HazelcastError_1.HazelcastSerializationError("This factory's number is " + this.factoryId + ".\n            Intended factory id is " + classDefinition.getFactoryId());
        }
        var cdKey = ClassDefinitionContext.encodeVersionedClassId(classDefinition.getClassId(), classDefinition.getVersion());
        var current = this.classDefs[cdKey];
        if (current == null) {
            this.classDefs[cdKey] = classDefinition;
            return classDefinition;
        }
        if (!current.equals(classDefinition)) {
            throw new HazelcastError_1.HazelcastSerializationError("Incompatible class definition with same class id:\n             " + classDefinition.getClassId());
        }
        return classDefinition;
    };
    return ClassDefinitionContext;
}());
exports.ClassDefinitionContext = ClassDefinitionContext;
//# sourceMappingURL=ClassDefinitionContext.js.map