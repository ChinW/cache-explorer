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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Long = require("long");
var BitsUtil_1 = require("../BitsUtil");
var HazelcastJsonValue_1 = require("../core/HazelcastJsonValue");
var StringSerializer = /** @class */ (function () {
    function StringSerializer() {
    }
    StringSerializer.prototype.getId = function () {
        return -11;
    };
    StringSerializer.prototype.read = function (input) {
        return input.readUTF();
    };
    StringSerializer.prototype.write = function (output, object) {
        output.writeUTF(object);
    };
    return StringSerializer;
}());
exports.StringSerializer = StringSerializer;
var DoubleSerializer = /** @class */ (function () {
    function DoubleSerializer() {
    }
    DoubleSerializer.prototype.getId = function () {
        return -10;
    };
    DoubleSerializer.prototype.read = function (input) {
        return input.readDouble();
    };
    DoubleSerializer.prototype.write = function (output, object) {
        output.writeDouble(object);
    };
    return DoubleSerializer;
}());
exports.DoubleSerializer = DoubleSerializer;
var BooleanSerializer = /** @class */ (function () {
    function BooleanSerializer() {
    }
    BooleanSerializer.prototype.getId = function () {
        return -4;
    };
    BooleanSerializer.prototype.read = function (input) {
        return input.readBoolean();
    };
    BooleanSerializer.prototype.write = function (output, object) {
        output.writeBoolean(object);
    };
    return BooleanSerializer;
}());
exports.BooleanSerializer = BooleanSerializer;
var NullSerializer = /** @class */ (function () {
    function NullSerializer() {
    }
    NullSerializer.prototype.getId = function () {
        return 0;
    };
    NullSerializer.prototype.read = function (input) {
        return null;
    };
    NullSerializer.prototype.write = function (output, object) {
        // Empty method
    };
    return NullSerializer;
}());
exports.NullSerializer = NullSerializer;
var ShortSerializer = /** @class */ (function () {
    function ShortSerializer() {
    }
    ShortSerializer.prototype.getId = function () {
        return -6;
    };
    ShortSerializer.prototype.read = function (input) {
        return input.readShort();
    };
    ShortSerializer.prototype.write = function (output, object) {
        output.writeShort(object);
    };
    return ShortSerializer;
}());
exports.ShortSerializer = ShortSerializer;
var IntegerSerializer = /** @class */ (function () {
    function IntegerSerializer() {
    }
    IntegerSerializer.prototype.getId = function () {
        return -7;
    };
    IntegerSerializer.prototype.read = function (input) {
        return input.readInt();
    };
    IntegerSerializer.prototype.write = function (output, object) {
        output.writeInt(object);
    };
    return IntegerSerializer;
}());
exports.IntegerSerializer = IntegerSerializer;
var LongSerializer = /** @class */ (function () {
    function LongSerializer() {
    }
    LongSerializer.prototype.getId = function () {
        return -8;
    };
    LongSerializer.prototype.read = function (input) {
        return input.readLong();
    };
    LongSerializer.prototype.write = function (output, object) {
        output.writeLong(object);
    };
    return LongSerializer;
}());
exports.LongSerializer = LongSerializer;
var FloatSerializer = /** @class */ (function () {
    function FloatSerializer() {
    }
    FloatSerializer.prototype.getId = function () {
        return -9;
    };
    FloatSerializer.prototype.read = function (input) {
        return input.readFloat();
    };
    FloatSerializer.prototype.write = function (output, object) {
        output.writeFloat(object);
    };
    return FloatSerializer;
}());
exports.FloatSerializer = FloatSerializer;
var DateSerializer = /** @class */ (function () {
    function DateSerializer() {
    }
    DateSerializer.prototype.getId = function () {
        return -25;
    };
    DateSerializer.prototype.read = function (input) {
        return new Date(input.readLong().toNumber());
    };
    DateSerializer.prototype.write = function (output, object) {
        output.writeLong(Long.fromNumber(object.getMilliseconds()));
    };
    return DateSerializer;
}());
exports.DateSerializer = DateSerializer;
var BooleanArraySerializer = /** @class */ (function () {
    function BooleanArraySerializer() {
    }
    BooleanArraySerializer.prototype.getId = function () {
        return -13;
    };
    BooleanArraySerializer.prototype.read = function (input) {
        return input.readBooleanArray();
    };
    BooleanArraySerializer.prototype.write = function (output, object) {
        output.writeBooleanArray(object);
    };
    return BooleanArraySerializer;
}());
exports.BooleanArraySerializer = BooleanArraySerializer;
var ShortArraySerializer = /** @class */ (function () {
    function ShortArraySerializer() {
    }
    ShortArraySerializer.prototype.getId = function () {
        return -15;
    };
    ShortArraySerializer.prototype.read = function (input) {
        return input.readShortArray();
    };
    ShortArraySerializer.prototype.write = function (output, object) {
        output.writeShortArray(object);
    };
    return ShortArraySerializer;
}());
exports.ShortArraySerializer = ShortArraySerializer;
var IntegerArraySerializer = /** @class */ (function () {
    function IntegerArraySerializer() {
    }
    IntegerArraySerializer.prototype.getId = function () {
        return -16;
    };
    IntegerArraySerializer.prototype.read = function (input) {
        return input.readIntArray();
    };
    IntegerArraySerializer.prototype.write = function (output, object) {
        output.writeIntArray(object);
    };
    return IntegerArraySerializer;
}());
exports.IntegerArraySerializer = IntegerArraySerializer;
var LongArraySerializer = /** @class */ (function () {
    function LongArraySerializer() {
    }
    LongArraySerializer.prototype.getId = function () {
        return -17;
    };
    LongArraySerializer.prototype.read = function (input) {
        return input.readLongArray();
    };
    LongArraySerializer.prototype.write = function (output, object) {
        output.writeLongArray(object);
    };
    return LongArraySerializer;
}());
exports.LongArraySerializer = LongArraySerializer;
var DoubleArraySerializer = /** @class */ (function () {
    function DoubleArraySerializer() {
    }
    DoubleArraySerializer.prototype.getId = function () {
        return -19;
    };
    DoubleArraySerializer.prototype.read = function (input) {
        return input.readDoubleArray();
    };
    DoubleArraySerializer.prototype.write = function (output, object) {
        output.writeDoubleArray(object);
    };
    return DoubleArraySerializer;
}());
exports.DoubleArraySerializer = DoubleArraySerializer;
var StringArraySerializer = /** @class */ (function () {
    function StringArraySerializer() {
    }
    StringArraySerializer.prototype.getId = function () {
        return -20;
    };
    StringArraySerializer.prototype.read = function (input) {
        return input.readUTFArray();
    };
    StringArraySerializer.prototype.write = function (output, object) {
        output.writeUTFArray(object);
    };
    return StringArraySerializer;
}());
exports.StringArraySerializer = StringArraySerializer;
var ByteSerializer = /** @class */ (function () {
    function ByteSerializer() {
    }
    ByteSerializer.prototype.getId = function () {
        return -3;
    };
    ByteSerializer.prototype.read = function (input) {
        return input.readByte();
    };
    ByteSerializer.prototype.write = function (output, object) {
        output.writeByte(object);
    };
    return ByteSerializer;
}());
exports.ByteSerializer = ByteSerializer;
var ByteArraySerializer = /** @class */ (function () {
    function ByteArraySerializer() {
    }
    ByteArraySerializer.prototype.getId = function () {
        return -12;
    };
    ByteArraySerializer.prototype.read = function (input) {
        return input.readByteArray();
    };
    ByteArraySerializer.prototype.write = function (output, object) {
        output.writeByteArray(object);
    };
    return ByteArraySerializer;
}());
exports.ByteArraySerializer = ByteArraySerializer;
var CharSerializer = /** @class */ (function () {
    function CharSerializer() {
    }
    CharSerializer.prototype.getId = function () {
        return -5;
    };
    CharSerializer.prototype.read = function (input) {
        return input.readChar();
    };
    CharSerializer.prototype.write = function (output, object) {
        output.writeChar(object);
    };
    return CharSerializer;
}());
exports.CharSerializer = CharSerializer;
var CharArraySerializer = /** @class */ (function () {
    function CharArraySerializer() {
    }
    CharArraySerializer.prototype.getId = function () {
        return -14;
    };
    CharArraySerializer.prototype.read = function (input) {
        return input.readCharArray();
    };
    CharArraySerializer.prototype.write = function (output, object) {
        output.writeCharArray(object);
    };
    return CharArraySerializer;
}());
exports.CharArraySerializer = CharArraySerializer;
var FloatArraySerializer = /** @class */ (function () {
    function FloatArraySerializer() {
    }
    FloatArraySerializer.prototype.getId = function () {
        return -18;
    };
    FloatArraySerializer.prototype.read = function (input) {
        return input.readFloatArray();
    };
    FloatArraySerializer.prototype.write = function (output, object) {
        output.writeFloatArray(object);
    };
    return FloatArraySerializer;
}());
exports.FloatArraySerializer = FloatArraySerializer;
var JavaClassSerializer = /** @class */ (function () {
    function JavaClassSerializer() {
    }
    JavaClassSerializer.prototype.getId = function () {
        return -24;
    };
    JavaClassSerializer.prototype.read = function (input) {
        return input.readUTF();
    };
    JavaClassSerializer.prototype.write = function (output, object) {
        output.writeUTF(object);
    };
    return JavaClassSerializer;
}());
exports.JavaClassSerializer = JavaClassSerializer;
var LinkedListSerializer = /** @class */ (function () {
    function LinkedListSerializer() {
    }
    LinkedListSerializer.prototype.getId = function () {
        return -30;
    };
    LinkedListSerializer.prototype.read = function (input) {
        var size = input.readInt();
        var result = null;
        if (size > BitsUtil_1.BitsUtil.NULL_ARRAY_LENGTH) {
            result = [];
            for (var i = 0; i < size; i++) {
                result.push(input.readObject());
            }
        }
        return result;
    };
    LinkedListSerializer.prototype.write = function (output, object) {
        // NULL method
    };
    return LinkedListSerializer;
}());
exports.LinkedListSerializer = LinkedListSerializer;
var ArrayListSerializer = /** @class */ (function (_super) {
    __extends(ArrayListSerializer, _super);
    function ArrayListSerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayListSerializer.prototype.getId = function () {
        return -29;
    };
    return ArrayListSerializer;
}(LinkedListSerializer));
exports.ArrayListSerializer = ArrayListSerializer;
var IdentifiedDataSerializableSerializer = /** @class */ (function () {
    function IdentifiedDataSerializableSerializer(factories) {
        this.factories = factories;
    }
    IdentifiedDataSerializableSerializer.prototype.getId = function () {
        return -2;
    };
    IdentifiedDataSerializableSerializer.prototype.read = function (input) {
        var isIdentified = input.readBoolean();
        if (!isIdentified) {
            throw new RangeError('Native clients does not support Data Serializable. Please use Identified Data Serializable');
        }
        var factoryId = input.readInt();
        var classId = input.readInt();
        var factory;
        factory = this.factories[factoryId];
        if (!factory) {
            throw new RangeError('There is no Identified Data Serializer factory with id ' + factoryId + '.');
        }
        var object = factory.create(classId);
        object.readData(input);
        return object;
    };
    IdentifiedDataSerializableSerializer.prototype.write = function (output, object) {
        output.writeBoolean(true);
        output.writeInt(object.getFactoryId());
        output.writeInt(object.getClassId());
        object.writeData(output);
    };
    return IdentifiedDataSerializableSerializer;
}());
exports.IdentifiedDataSerializableSerializer = IdentifiedDataSerializableSerializer;
var JsonSerializer = /** @class */ (function () {
    function JsonSerializer() {
    }
    JsonSerializer.prototype.getId = function () {
        return -130;
    };
    JsonSerializer.prototype.read = function (input) {
        return JSON.parse(input.readUTF());
    };
    JsonSerializer.prototype.write = function (output, object) {
        if (object instanceof HazelcastJsonValue_1.HazelcastJsonValue) {
            output.writeUTF(object.toString());
        }
        else {
            output.writeUTF(JSON.stringify(object));
        }
    };
    return JsonSerializer;
}());
exports.JsonSerializer = JsonSerializer;
var HazelcastJsonValueSerializer = /** @class */ (function (_super) {
    __extends(HazelcastJsonValueSerializer, _super);
    function HazelcastJsonValueSerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HazelcastJsonValueSerializer.prototype.read = function (input) {
        return new HazelcastJsonValue_1.HazelcastJsonValue(input.readUTF());
    };
    return HazelcastJsonValueSerializer;
}(JsonSerializer));
exports.HazelcastJsonValueSerializer = HazelcastJsonValueSerializer;
//# sourceMappingURL=DefaultSerializer.js.map