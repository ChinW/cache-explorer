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
var Promise = require("bluebird");
var MapAddNearCacheInvalidationListenerCodec_1 = require("../codec/MapAddNearCacheInvalidationListenerCodec");
var MapRemoveEntryListenerCodec_1 = require("../codec/MapRemoveEntryListenerCodec");
var EventType_1 = require("../core/EventType");
var StaleReadDetectorImpl_1 = require("../nearcache/StaleReadDetectorImpl");
var MapProxy_1 = require("./MapProxy");
var NearCachedMapProxy = /** @class */ (function (_super) {
    __extends(NearCachedMapProxy, _super);
    function NearCachedMapProxy(client, servicename, name) {
        var _this = _super.call(this, client, servicename, name) || this;
        _this.nearCache = _this.client.getNearCacheManager().getOrCreateNearCache(name);
        if (_this.nearCache.isInvalidatedOnChange()) {
            _this.addNearCacheInvalidationListener().then(function (id) {
                _this.invalidationListenerId = id;
                _this.nearCache.setReady();
            });
        }
        else {
            _this.nearCache.setReady();
        }
        return _this;
    }
    NearCachedMapProxy.prototype.clear = function () {
        return _super.prototype.clear.call(this).then(this.invalidateCacheAndReturn.bind(this));
    };
    NearCachedMapProxy.prototype.evictAll = function () {
        this.nearCache.clear();
        return _super.prototype.evictAll.call(this).then(this.invalidateCacheAndReturn.bind(this));
    };
    NearCachedMapProxy.prototype.containsKeyInternal = function (keyData) {
        var _this = this;
        return this.nearCache.get(keyData).then(function (cachedValue) {
            if (cachedValue !== undefined) {
                return Promise.resolve(cachedValue != null);
            }
            else {
                return _super.prototype.containsKeyInternal.call(_this, keyData);
            }
        });
    };
    NearCachedMapProxy.prototype.deleteInternal = function (keyData) {
        this.nearCache.invalidate(keyData);
        return _super.prototype.deleteInternal.call(this, keyData).then(this.invalidateCacheEntryAndReturn.bind(this, keyData));
    };
    NearCachedMapProxy.prototype.evictInternal = function (key) {
        return _super.prototype.evictInternal.call(this, key).then(this.invalidateCacheEntryAndReturn.bind(this, key));
    };
    NearCachedMapProxy.prototype.putAllInternal = function (partitionsToKeysData) {
        var _this = this;
        return _super.prototype.putAllInternal.call(this, partitionsToKeysData).then(function () {
            for (var partition in partitionsToKeysData) {
                partitionsToKeysData[partition].forEach(function (entry) {
                    _this.nearCache.invalidate(entry[0]);
                });
            }
        });
    };
    NearCachedMapProxy.prototype.postDestroy = function () {
        var _this = this;
        return this.removeNearCacheInvalidationListener().then(function () {
            _this.client.getNearCacheManager().destroyNearCache(_this.name);
        }).then(function () {
            return _super.prototype.postDestroy.call(_this);
        });
    };
    NearCachedMapProxy.prototype.putIfAbsentInternal = function (keyData, valueData, ttl) {
        return _super.prototype.putIfAbsentInternal.call(this, keyData, valueData, ttl).then(this.invalidateCacheEntryAndReturn.bind(this, keyData));
    };
    NearCachedMapProxy.prototype.putTransientInternal = function (keyData, valueData, ttl) {
        return _super.prototype.putTransientInternal.call(this, keyData, valueData, ttl).then(this.invalidateCacheEntryAndReturn.bind(this, keyData));
    };
    NearCachedMapProxy.prototype.executeOnKeyInternal = function (keyData, proData) {
        return _super.prototype.executeOnKeyInternal.call(this, keyData, proData).then(this.invalidateCacheEntryAndReturn.bind(this, keyData));
    };
    NearCachedMapProxy.prototype.putInternal = function (keyData, valueData, ttl) {
        return _super.prototype.putInternal.call(this, keyData, valueData, ttl).then(this.invalidateCacheEntryAndReturn.bind(this, keyData));
    };
    NearCachedMapProxy.prototype.getInternal = function (keyData) {
        var _this = this;
        return this.nearCache.get(keyData).then(function (cachedValue) {
            if (cachedValue !== undefined) {
                return Promise.resolve(cachedValue);
            }
            else {
                var reservation_1 = _this.nearCache.tryReserveForUpdate(keyData);
                return _super.prototype.getInternal.call(_this, keyData).then(function (val) {
                    _this.nearCache.tryPublishReserved(keyData, val, reservation_1);
                    return val;
                }).catch(function (err) {
                    throw err;
                });
            }
        });
    };
    NearCachedMapProxy.prototype.tryRemoveInternal = function (keyData, timeout) {
        return _super.prototype.tryRemoveInternal.call(this, keyData, timeout).then(this.invalidateCacheEntryAndReturn.bind(this, keyData));
    };
    NearCachedMapProxy.prototype.removeInternal = function (keyData, value) {
        return _super.prototype.removeInternal.call(this, keyData, value).then(this.invalidateCacheEntryAndReturn.bind(this, keyData));
    };
    NearCachedMapProxy.prototype.getAllInternal = function (partitionsToKeys, result) {
        var _this = this;
        if (result === void 0) { result = []; }
        var promises = [];
        try {
            var _loop_1 = function (partition) {
                var partitionArray = partitionsToKeys[partition];
                var _loop_2 = function (i) {
                    var key = partitionArray[i];
                    promises.push(this_1.nearCache.get(key).then(function (cachedResult) {
                        if (cachedResult !== undefined) {
                            result.push([_this.toObject(partitionArray[i]), cachedResult]);
                            partitionArray = partitionArray.splice(i, 1);
                        }
                    }));
                };
                for (var i = partitionArray.length - 1; i >= 0; i--) {
                    _loop_2(i);
                }
            };
            var this_1 = this;
            for (var partition in partitionsToKeys) {
                _loop_1(partition);
            }
        }
        catch (err) {
            return Promise.resolve([]);
        }
        return Promise.all(promises).then(function () {
            var reservations = [];
            for (var partition in partitionsToKeys) {
                var partitionArray = partitionsToKeys[partition];
                for (var _i = 0, partitionArray_1 = partitionArray; _i < partitionArray_1.length; _i++) {
                    var key = partitionArray_1[_i];
                    reservations.push(_this.nearCache.tryReserveForUpdate(key));
                }
            }
            return _super.prototype.getAllInternal.call(_this, partitionsToKeys, result).then(function (serializedEntryArray) {
                serializedEntryArray.forEach(function (serializedEntry, index) {
                    var key = serializedEntry[0];
                    var value = serializedEntry[1];
                    _this.nearCache.tryPublishReserved(key, value, reservations[index]);
                });
                return result;
            });
        });
    };
    NearCachedMapProxy.prototype.replaceIfSameInternal = function (keyData, oldValueData, newValueData) {
        return _super.prototype.replaceIfSameInternal.call(this, keyData, oldValueData, newValueData)
            .then(this.invalidateCacheEntryAndReturn.bind(this, keyData));
    };
    NearCachedMapProxy.prototype.replaceInternal = function (keyData, valueData) {
        return _super.prototype.replaceInternal.call(this, keyData, valueData).then(this.invalidateCacheEntryAndReturn.bind(this, keyData));
    };
    NearCachedMapProxy.prototype.setInternal = function (keyData, valueData, ttl) {
        return _super.prototype.setInternal.call(this, keyData, valueData, ttl).then(this.invalidateCacheEntryAndReturn.bind(this, keyData));
    };
    NearCachedMapProxy.prototype.tryPutInternal = function (keyData, valueData, timeout) {
        return _super.prototype.tryPutInternal.call(this, keyData, valueData, timeout)
            .then(this.invalidateCacheEntryAndReturn.bind(this, keyData));
    };
    NearCachedMapProxy.prototype.removeNearCacheInvalidationListener = function () {
        this.client.getRepairingTask().deregisterHandler(this.name);
        return this.client.getListenerService().deregisterListener(this.invalidationListenerId);
    };
    NearCachedMapProxy.prototype.invalidateCacheEntryAndReturn = function (keyData, retVal) {
        this.nearCache.invalidate(keyData);
        return retVal;
    };
    NearCachedMapProxy.prototype.invalidateCacheAndReturn = function (retVal) {
        this.nearCache.clear();
        return retVal;
    };
    NearCachedMapProxy.prototype.addNearCacheInvalidationListener = function () {
        var _this = this;
        var codec = this.createInvalidationListenerCodec(this.name, EventType_1.EventType.INVALIDATION);
        return this.createNearCacheEventHandler().then(function (handler) {
            return _this.client.getListenerService().registerListener(codec, handler);
        });
    };
    NearCachedMapProxy.prototype.createInvalidationListenerCodec = function (name, flags) {
        return {
            encodeAddRequest: function (localOnly) {
                return MapAddNearCacheInvalidationListenerCodec_1.MapAddNearCacheInvalidationListenerCodec.encodeRequest(name, flags, localOnly);
            },
            decodeAddResponse: function (msg) {
                return MapAddNearCacheInvalidationListenerCodec_1.MapAddNearCacheInvalidationListenerCodec.decodeResponse(msg).response;
            },
            encodeRemoveRequest: function (listenerId) {
                return MapRemoveEntryListenerCodec_1.MapRemoveEntryListenerCodec.encodeRequest(name, listenerId);
            },
        };
    };
    NearCachedMapProxy.prototype.createNearCacheEventHandler = function () {
        var _this = this;
        var repairingTask = this.client.getRepairingTask();
        return repairingTask.registerAndGetHandler(this.getName(), this.nearCache).then(function (repairingHandler) {
            var staleReadDetector = new StaleReadDetectorImpl_1.StaleReadDetectorImpl(repairingHandler, _this.client.getPartitionService());
            _this.nearCache.setStaleReadDetector(staleReadDetector);
            var handle = function (key, sourceUuid, partitionUuid, sequence) {
                repairingHandler.handle(key, sourceUuid, partitionUuid, sequence);
            };
            var handleBatch = function (keys, sourceUuids, partititonUuids, sequences) {
                repairingHandler.handleBatch(keys, sourceUuids, partititonUuids, sequences);
            };
            return function (m) {
                MapAddNearCacheInvalidationListenerCodec_1.MapAddNearCacheInvalidationListenerCodec.handle(m, handle, handleBatch);
            };
        });
    };
    return NearCachedMapProxy;
}(MapProxy_1.MapProxy));
exports.NearCachedMapProxy = NearCachedMapProxy;
//# sourceMappingURL=NearCachedMapProxy.js.map