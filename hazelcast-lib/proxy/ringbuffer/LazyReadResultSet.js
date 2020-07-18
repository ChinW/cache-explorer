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
var LazyReadResultSet = /** @class */ (function () {
    function LazyReadResultSet(serializationService, readCount, items, itemSeqs) {
        this.serializationService = serializationService;
        this.readCount = readCount;
        this.items = items;
        this.itemSeqs = itemSeqs;
    }
    LazyReadResultSet.prototype.getReadCount = function () {
        return this.readCount;
    };
    LazyReadResultSet.prototype.get = function (index) {
        var dataOrObject = this.items[index];
        if (dataOrObject == null) {
            return undefined;
        }
        if (this.serializationService.isData(dataOrObject)) {
            var obj = this.serializationService.toObject(dataOrObject);
            this.items[index] = obj;
            return obj;
        }
        else {
            return dataOrObject;
        }
    };
    LazyReadResultSet.prototype.getSequence = function (index) {
        if (this.itemSeqs == null) {
            throw new HazelcastError_1.UnsupportedOperationError('Sequence IDs are not available when the cluster version is lower than 3.9');
        }
        return this.itemSeqs[index];
    };
    LazyReadResultSet.prototype.size = function () {
        return this.items.length;
    };
    return LazyReadResultSet;
}());
exports.LazyReadResultSet = LazyReadResultSet;
//# sourceMappingURL=LazyReadResultSet.js.map