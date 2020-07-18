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
var Predicate_1 = require("../core/Predicate");
/**
 * Defines an assortment of transformations which can be applied to
 * {@link BitmapIndexOptions#uniqueKey unique key} values.
 */
var UniqueKeyTransformation;
(function (UniqueKeyTransformation) {
    /**
     * Extracted unique key value is interpreted as an object value.
     * Non-negative unique ID is assigned to every distinct object value.
     */
    UniqueKeyTransformation[UniqueKeyTransformation["OBJECT"] = 0] = "OBJECT";
    /**
     * Extracted unique key value is interpreted as a whole integer value of
     * byte, short, int or long type. The extracted value is upcasted to
     * long (if necessary) and unique non-negative ID is assigned to every
     * distinct value.
     */
    UniqueKeyTransformation[UniqueKeyTransformation["LONG"] = 1] = "LONG";
    /**
     * Extracted unique key value is interpreted as a whole integer value of
     * byte, short, int or long type. The extracted value is upcasted to
     * long (if necessary) and the resulting value is used directly as an ID.
     */
    UniqueKeyTransformation[UniqueKeyTransformation["RAW"] = 2] = "RAW";
})(UniqueKeyTransformation = exports.UniqueKeyTransformation || (exports.UniqueKeyTransformation = {}));
var DEFAULT_UNIQUE_KEY = Predicate_1.QueryConstants.KEY_ATTRIBUTE_NAME;
var DEFAULT_UNIQUE_KEY_TRANSFORMATION = UniqueKeyTransformation.OBJECT;
/**
 * Configures indexing options specific to bitmap indexes.
 */
var BitmapIndexOptions = /** @class */ (function () {
    function BitmapIndexOptions(uniqueKey, uniqueKeyTransformation) {
        if (uniqueKey === void 0) { uniqueKey = DEFAULT_UNIQUE_KEY; }
        if (uniqueKeyTransformation === void 0) { uniqueKeyTransformation = DEFAULT_UNIQUE_KEY_TRANSFORMATION; }
        this.uniqueKey = uniqueKey;
        this.uniqueKeyTransformation = uniqueKeyTransformation;
    }
    BitmapIndexOptions.prototype.toString = function () {
        return 'BitmapIndexOptions[' +
            'uniqueKey: ' + this.uniqueKey +
            ', uniqueKeyTransformation: ' + this.uniqueKeyTransformation +
            ']';
    };
    return BitmapIndexOptions;
}());
exports.BitmapIndexOptions = BitmapIndexOptions;
//# sourceMappingURL=BitmapIndexOptions.js.map