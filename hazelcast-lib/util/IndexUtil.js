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
var IndexConfig_1 = require("../config/IndexConfig");
var IndexType_1 = require("../config/IndexType");
var BitmapIndexOptions_1 = require("../config/BitmapIndexOptions");
/**
 * Maximum number of attributes allowed in the index.
 */
var MAX_ATTRIBUTES = 255;
/**
 * Pattern to stripe away "this." prefix.
 */
var THIS_PATTERN = new RegExp('^this\\.');
var IndexUtil = /** @class */ (function () {
    function IndexUtil() {
    }
    /**
     * Validate provided index config and normalize it's name and attribute names.
     *
     * @param mapName Name of the map
     * @param config Index config.
     * @return Normalized index config.
     * @throws TypeError If index configuration is invalid.
     */
    IndexUtil.validateAndNormalize = function (mapName, config) {
        // Validate attributes
        var originalAttributeNames = config.attributes;
        if (originalAttributeNames.length === 0) {
            throw new TypeError('Index must have at least one attribute: ' + config.toString());
        }
        if (originalAttributeNames.length > MAX_ATTRIBUTES) {
            throw new TypeError('Index cannot have more than ' + MAX_ATTRIBUTES + ' attributes: ' + config.toString());
        }
        if (config.type === IndexType_1.IndexType.BITMAP && originalAttributeNames.length > 1) {
            throw new TypeError('Composite bitmap indexes are not supported: ' + config.toString());
        }
        var normalizedAttributeNames = new Array(originalAttributeNames.length);
        for (var i = 0; i < originalAttributeNames.length; i++) {
            var originalAttributeName = originalAttributeNames[i];
            this.validateAttribute(config, originalAttributeName);
            originalAttributeName = originalAttributeName.trim();
            var normalizedAttributeName = this.canonicalizeAttribute(originalAttributeName);
            var existingIdx = normalizedAttributeNames.indexOf(normalizedAttributeName);
            if (existingIdx !== -1) {
                var duplicateOriginalAttributeName = originalAttributeNames[existingIdx];
                if (duplicateOriginalAttributeName === originalAttributeName) {
                    throw new TypeError('Duplicate attribute name [attributeName= '
                        + originalAttributeName + ', indexConfig=' + config.toString() + ']');
                }
                else {
                    throw new TypeError('Duplicate attribute names [attributeName1='
                        + duplicateOriginalAttributeName + ', attributeName2='
                        + originalAttributeName + ', indexConfig=' + config.toString() + ']');
                }
            }
            normalizedAttributeNames[i] = normalizedAttributeName;
        }
        // Construct final index
        var name = config.name;
        if (name != null && name.trim().length === 0) {
            name = null;
        }
        var normalizedConfig = this.buildNormalizedConfig(mapName, config.type, name, normalizedAttributeNames);
        if (config.type === IndexType_1.IndexType.BITMAP) {
            var uniqueKey = config.bitmapIndexOptions.uniqueKey;
            var uniqueKeyTransformation = config.bitmapIndexOptions.uniqueKeyTransformation;
            this.validateAttribute(config, uniqueKey);
            uniqueKey = this.canonicalizeAttribute(uniqueKey);
            normalizedConfig.bitmapIndexOptions.uniqueKey = uniqueKey;
            normalizedConfig.bitmapIndexOptions.uniqueKeyTransformation = uniqueKeyTransformation;
        }
        return normalizedConfig;
    };
    /**
     * Validate attribute name.
     *
     * @param config Index config.
     * @param attributeName Attribute name.
     */
    IndexUtil.validateAttribute = function (config, attributeName) {
        if (attributeName == null) {
            throw new TypeError('Attribute name cannot be null: ' + config);
        }
        var attributeName0 = attributeName.trim();
        if (attributeName0.length === 0) {
            throw new TypeError('Attribute name cannot be empty: ' + config);
        }
        if (attributeName0.endsWith('.')) {
            throw new TypeError('Attribute name cannot end with dot [config= ' + config
                + ', attribute=' + attributeName + ']');
        }
    };
    /**
     * Produces canonical attribute representation by stripping an unnecessary
     * "this." qualifier from the passed attribute, if any.
     *
     * @param attribute the attribute to canonicalize.
     * @return the canonical attribute representation.
     */
    IndexUtil.canonicalizeAttribute = function (attribute) {
        return attribute.replace(THIS_PATTERN, '');
    };
    IndexUtil.buildNormalizedConfig = function (mapName, indexType, indexName, normalizedAttributeNames) {
        var newConfig = new IndexConfig_1.IndexConfig();
        newConfig.bitmapIndexOptions = new BitmapIndexOptions_1.BitmapIndexOptions();
        newConfig.type = indexType;
        var name = indexName == null ? mapName + '_' + this.getIndexTypeName(indexType) : null;
        for (var _i = 0, normalizedAttributeNames_1 = normalizedAttributeNames; _i < normalizedAttributeNames_1.length; _i++) {
            var normalizedAttributeName = normalizedAttributeNames_1[_i];
            newConfig.addAttribute(normalizedAttributeName);
            if (name != null) {
                name += '_' + normalizedAttributeName;
            }
        }
        if (name != null) {
            indexName = name;
        }
        newConfig.name = indexName;
        return newConfig;
    };
    IndexUtil.getIndexTypeName = function (indexType) {
        switch (indexType) {
            case IndexType_1.IndexType.SORTED:
                return 'sorted';
            case IndexType_1.IndexType.HASH:
                return 'hash';
            case IndexType_1.IndexType.BITMAP:
                return 'bitmap';
            default:
                throw new TypeError('Unsupported index type: ' + indexType);
        }
    };
    return IndexUtil;
}());
exports.IndexUtil = IndexUtil;
//# sourceMappingURL=IndexUtil.js.map