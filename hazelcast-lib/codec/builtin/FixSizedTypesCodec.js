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
var Long = require("long");
var BitsUtil_1 = require("../../BitsUtil");
var UUID_1 = require("../../core/UUID");
var FixSizedTypesCodec = /** @class */ (function () {
    function FixSizedTypesCodec() {
    }
    FixSizedTypesCodec.encodeInt = function (buffer, offset, value) {
        buffer.writeInt32LE(value, offset);
    };
    FixSizedTypesCodec.decodeInt = function (buffer, offset) {
        return buffer.readInt32LE(offset);
    };
    FixSizedTypesCodec.encodeLong = function (buffer, offset, value) {
        if (!Long.isLong(value)) {
            value = Long.fromValue(value);
        }
        buffer.writeInt32LE(value.low, offset);
        buffer.writeInt32LE(value.high, offset + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES);
    };
    FixSizedTypesCodec.decodeLong = function (buffer, offset) {
        var low = buffer.readInt32LE(offset);
        var high = buffer.readInt32LE(offset + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES);
        return new Long(low, high);
    };
    FixSizedTypesCodec.encodeBoolean = function (buffer, offset, value) {
        buffer.writeUInt8(value ? 1 : 0, offset);
    };
    FixSizedTypesCodec.decodeBoolean = function (buffer, offset) {
        return buffer.readUInt8(offset) === 1;
    };
    FixSizedTypesCodec.encodeByte = function (buffer, offset, value) {
        buffer.writeUInt8(value, offset);
    };
    FixSizedTypesCodec.decodeByte = function (buffer, offset) {
        return buffer.readUInt8(offset);
    };
    FixSizedTypesCodec.encodeUUID = function (buffer, offset, value) {
        var isNull = value === null;
        this.encodeBoolean(buffer, offset, isNull);
        if (isNull) {
            return;
        }
        var mostSignificantBits = value.mostSignificant;
        var leastSignificantBits = value.leastSignificant;
        this.encodeLong(buffer, offset + BitsUtil_1.BitsUtil.BOOLEAN_SIZE_IN_BYTES, mostSignificantBits);
        this.encodeLong(buffer, offset + BitsUtil_1.BitsUtil.BOOLEAN_SIZE_IN_BYTES + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES, leastSignificantBits);
    };
    FixSizedTypesCodec.decodeUUID = function (buffer, offset) {
        var isNull = this.decodeBoolean(buffer, offset);
        if (isNull) {
            return null;
        }
        var mostSignificantBits = this.decodeLong(buffer, offset + BitsUtil_1.BitsUtil.BOOLEAN_SIZE_IN_BYTES);
        var leastSignificantBits = this.decodeLong(buffer, offset + BitsUtil_1.BitsUtil.BOOLEAN_SIZE_IN_BYTES + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES);
        return new UUID_1.UUID(mostSignificantBits, leastSignificantBits);
    };
    return FixSizedTypesCodec;
}());
exports.FixSizedTypesCodec = FixSizedTypesCodec;
//# sourceMappingURL=FixSizedTypesCodec.js.map