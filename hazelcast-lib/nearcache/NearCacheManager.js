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
var NearCache_1 = require("./NearCache");
var NearCacheManager = /** @class */ (function () {
    function NearCacheManager(client) {
        this.caches = new Map();
        this.client = client;
    }
    NearCacheManager.prototype.getOrCreateNearCache = function (name) {
        var nearCache = this.caches.get(name);
        if (nearCache == null) {
            nearCache = new NearCache_1.NearCacheImpl(this.client.getConfig().getNearCacheConfig(name), this.client.getSerializationService());
            this.caches.set(name, nearCache);
        }
        return nearCache;
    };
    NearCacheManager.prototype.destroyNearCache = function (name) {
        var nearCache = this.caches.get(name);
        if (nearCache != null) {
            this.caches.delete(name);
            nearCache.clear();
        }
    };
    NearCacheManager.prototype.destroyAllNearCaches = function () {
        this.caches.forEach(function (cache) {
            cache.clear();
        });
        this.caches.clear();
    };
    NearCacheManager.prototype.listAllNearCaches = function () {
        return Array.from(this.caches.values());
    };
    NearCacheManager.prototype.clearAllNearCaches = function () {
        for (var _i = 0, _a = this.listAllNearCaches(); _i < _a.length; _i++) {
            var nearCache = _a[_i];
            nearCache.clear();
        }
    };
    return NearCacheManager;
}());
exports.NearCacheManager = NearCacheManager;
//# sourceMappingURL=NearCacheManager.js.map