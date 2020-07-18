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
var murmur = require("../invocation/Murmur");
exports.PARTITION_HASH_OFFSET = 0;
exports.TYPE_OFFSET = 4;
exports.DATA_OFFSET = 8;
exports.HEAP_DATA_OVERHEAD = exports.DATA_OFFSET;
var HeapData = /** @class */ (function () {
    function HeapData(buffer) {
        if (buffer != null && buffer.length > 0 && buffer.length < exports.HEAP_DATA_OVERHEAD) {
            throw new RangeError('Data should be either empty or should contain more than ' + exports.HEAP_DATA_OVERHEAD
                + ' bytes! -> '
                + buffer);
        }
        this.payload = buffer;
    }
    /**
     * Returns serialized representation in a buffer
     */
    HeapData.prototype.toBuffer = function () {
        return this.payload;
    };
    /**
     * Returns serialization type
     */
    HeapData.prototype.getType = function () {
        if (this.totalSize() === 0) {
            // TODO serialization null type
            return 0;
        }
        return this.payload.readIntBE(exports.TYPE_OFFSET, 4);
    };
    /**
     * Returns the total size of data in bytes
     */
    HeapData.prototype.totalSize = function () {
        if (this.payload === null) {
            return 0;
        }
        else {
            return this.payload.length;
        }
    };
    /**
     * Returns size of internal binary data in bytes
     */
    HeapData.prototype.dataSize = function () {
        return Math.max(this.totalSize() - exports.HEAP_DATA_OVERHEAD, 0);
    };
    /**
     * Returns approximate heap cost of this Data object in bytes
     */
    HeapData.prototype.getHeapCost = function () {
        return 0;
    };
    /**
     * Returns partition hash of serialized object
     */
    HeapData.prototype.getPartitionHash = function () {
        if (this.hasPartitionHash()) {
            return this.payload.readIntBE(exports.PARTITION_HASH_OFFSET, 4);
        }
        else {
            return this.hashCode();
        }
    };
    HeapData.prototype.hashCode = function () {
        return murmur(this.payload.slice(exports.DATA_OFFSET));
    };
    HeapData.prototype.equals = function (other) {
        return this.payload.compare(other.toBuffer(), exports.DATA_OFFSET, other.toBuffer().length, exports.DATA_OFFSET) === 0;
    };
    /**
     * Returns true if data has partition hash
     */
    HeapData.prototype.hasPartitionHash = function () {
        return this.payload !== null
            && this.payload.length >= exports.HEAP_DATA_OVERHEAD
            && this.payload.readIntBE(exports.PARTITION_HASH_OFFSET, 4) !== 0;
    };
    /**
     * Returns true if the object is a portable object
     */
    HeapData.prototype.isPortable = function () {
        return false;
    };
    return HeapData;
}());
exports.HeapData = HeapData;
//# sourceMappingURL=HeapData.js.map