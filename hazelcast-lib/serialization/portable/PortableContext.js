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
var ClassDefinitionContext_1 = require("./ClassDefinitionContext");
var ClassDefinition_1 = require("./ClassDefinition");
var ClassDefinitionWriter_1 = require("./ClassDefinitionWriter");
var BitsUtil_1 = require("../../BitsUtil");
var ClassDefinitionBuilder_1 = require("./ClassDefinitionBuilder");
var PortableContext = /** @class */ (function () {
    function PortableContext(service, portableVersion) {
        this.service = service;
        this.version = portableVersion;
        this.classDefContext = {};
    }
    PortableContext.prototype.getVersion = function () {
        return this.version;
    };
    PortableContext.prototype.readClassDefinitionFromInput = function (input, factoryId, classId, version) {
        var register = true;
        var builder = new ClassDefinitionBuilder_1.ClassDefinitionBuilder(factoryId, classId, version);
        input.readInt();
        var fieldCount = input.readInt();
        var offset = input.position();
        for (var i = 0; i < fieldCount; i++) {
            var pos = input.readInt(offset + i * BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES);
            input.position(pos);
            var len = input.readShort();
            var chars = '';
            for (var j = 0; j < len; j++) {
                chars += String.fromCharCode(input.readUnsignedByte());
            }
            var type = input.readByte();
            var name = chars;
            var fieldFactoryId = 0;
            var fieldClassId = 0;
            var fieldVersion = this.version;
            if (type === ClassDefinition_1.FieldType.PORTABLE) {
                // is null
                if (input.readBoolean()) {
                    register = false;
                }
                fieldFactoryId = input.readInt();
                fieldClassId = input.readInt();
                // TODO: what there's a null inner Portable field
                if (register) {
                    fieldVersion = input.readInt();
                    this.readClassDefinitionFromInput(input, fieldFactoryId, fieldClassId, fieldVersion);
                }
            }
            else if (type === ClassDefinition_1.FieldType.PORTABLE_ARRAY) {
                var k = input.readInt();
                fieldFactoryId = input.readInt();
                fieldClassId = input.readInt();
                // TODO: what there's a null inner Portable field
                if (k > 0) {
                    var p = input.readInt();
                    input.position(p);
                    fieldVersion = input.readInt();
                    this.readClassDefinitionFromInput(input, fieldFactoryId, fieldClassId, fieldVersion);
                }
                else {
                    register = false;
                }
            }
            builder.addField(new ClassDefinition_1.FieldDefinition(i, name, type, fieldVersion, fieldFactoryId, fieldClassId));
        }
        var classDefinition = builder.build();
        if (register) {
            classDefinition = this.registerClassDefinition(classDefinition);
        }
        return classDefinition;
    };
    PortableContext.prototype.lookupOrRegisterClassDefinition = function (p) {
        var portableVersion = this.getClassVersion(p);
        var cd = this.lookupClassDefinition(p.getFactoryId(), p.getClassId(), portableVersion);
        if (cd == null) {
            var writer = new ClassDefinitionWriter_1.ClassDefinitionWriter(this, new ClassDefinitionBuilder_1.ClassDefinitionBuilder(p.getFactoryId(), p.getClassId(), portableVersion));
            p.writePortable(writer);
            cd = writer.registerAndGet();
        }
        return cd;
    };
    PortableContext.prototype.lookupClassDefinition = function (factoryId, classId, version) {
        var factory = this.classDefContext[factoryId];
        if (factory == null) {
            return null;
        }
        else {
            return factory.lookup(classId, version);
        }
    };
    PortableContext.prototype.registerClassDefinition = function (classDefinition) {
        var factoryId = classDefinition.getFactoryId();
        if (!this.classDefContext[factoryId]) {
            this.classDefContext[factoryId] = new ClassDefinitionContext_1.ClassDefinitionContext(factoryId);
        }
        return this.classDefContext[factoryId].register(classDefinition);
    };
    PortableContext.prototype.getClassVersion = function (portable) {
        if (portable.getVersion) {
            if (portable.getVersion() < 0) {
                throw new RangeError('Version cannot be negative!');
            }
            return portable.getVersion();
        }
        else {
            return this.version;
        }
    };
    return PortableContext;
}());
exports.PortableContext = PortableContext;
//# sourceMappingURL=PortableContext.js.map