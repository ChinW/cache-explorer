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
var IndexType_1 = require("./IndexType");
var IndexUtil_1 = require("../util/IndexUtil");
/**
 * Configuration of an index. Hazelcast support two types of indexes: sorted index and hash index.
 * Sorted indexes could be used with equality and range predicates and have logarithmic search time.
 * Hash indexes could be used with equality predicates and have constant search time assuming the hash
 * function of the indexed field disperses the elements properly.
 *
 * Index could be created on one or more attributes.
 *
 * @see {@link IndexType}
 */
var IndexConfig = /** @class */ (function () {
    function IndexConfig(name, type, attributes, bitmapIndexOptions) {
        /**
         * Type of the index.
         */
        this.type = IndexConfig.DEFAULT_TYPE;
        /**
         * Indexed attributes.
         */
        this.attributes = [];
        if (name) {
            this.name = name;
        }
        if (type) {
            this.type = type;
        }
        if (attributes) {
            this.attributes = attributes;
        }
        if (bitmapIndexOptions) {
            this.bitmapIndexOptions = bitmapIndexOptions;
        }
    }
    IndexConfig.prototype.addAttribute = function (attribute) {
        IndexUtil_1.IndexUtil.validateAttribute(this, attribute);
        this.attributes.push(attribute);
        return this;
    };
    IndexConfig.prototype.toString = function () {
        var bitmapIndexOptions;
        if (this.bitmapIndexOptions == null) {
            bitmapIndexOptions = undefined;
        }
        else {
            bitmapIndexOptions = this.bitmapIndexOptions.toString();
        }
        return 'IndexConfig[' +
            'name: ' + this.name +
            ', type: ' + this.type +
            ', attributes: ' + this.attributes +
            ', bitmapIndexOptions: ' + bitmapIndexOptions +
            ']';
    };
    /**
     * Default index type.
     */
    IndexConfig.DEFAULT_TYPE = IndexType_1.IndexType.SORTED;
    return IndexConfig;
}());
exports.IndexConfig = IndexConfig;
//# sourceMappingURL=IndexConfig.js.map