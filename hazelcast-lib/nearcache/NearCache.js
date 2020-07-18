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
var EvictionPolicy_1 = require("../config/EvictionPolicy");
var InMemoryFormat_1 = require("../config/InMemoryFormat");
var DataStoreHashMap_1 = require("../DataStoreHashMap");
var Util_1 = require("../Util");
var AlwaysFreshStaleReadDetectorImpl = require("./AlwaysFreshStaleReadDetectorImpl");
var DataRecord_1 = require("./DataRecord");
var NearCacheImpl = /** @class */ (function () {
    function NearCacheImpl(nearCacheConfig, serializationService) {
        this.staleReadDetector = AlwaysFreshStaleReadDetectorImpl.INSTANCE;
        this.reservationCounter = Long.ZERO;
        this.evictedCount = 0;
        this.expiredCount = 0;
        this.missCount = 0;
        this.hitCount = 0;
        this.creationTime = Date.now();
        this.serializationService = serializationService;
        this.name = nearCacheConfig.name;
        this.invalidateOnChange = nearCacheConfig.invalidateOnChange;
        this.maxIdleSeconds = nearCacheConfig.maxIdleSeconds;
        this.inMemoryFormat = nearCacheConfig.inMemoryFormat;
        this.timeToLiveSeconds = nearCacheConfig.timeToLiveSeconds;
        this.evictionPolicy = nearCacheConfig.evictionPolicy;
        this.evictionMaxSize = nearCacheConfig.evictionMaxSize;
        this.evictionSamplingCount = nearCacheConfig.evictionSamplingCount;
        this.evictionSamplingPoolSize = nearCacheConfig.evictionSamplingPoolSize;
        if (this.evictionPolicy === EvictionPolicy_1.EvictionPolicy.LFU) {
            this.compareFunc = DataRecord_1.DataRecord.lfuComp;
        }
        else if (this.evictionPolicy === EvictionPolicy_1.EvictionPolicy.LRU) {
            this.compareFunc = DataRecord_1.DataRecord.lruComp;
        }
        else if (this.evictionPolicy === EvictionPolicy_1.EvictionPolicy.RANDOM) {
            this.compareFunc = DataRecord_1.DataRecord.randomComp;
        }
        else {
            this.compareFunc = undefined;
        }
        this.evictionCandidatePool = [];
        this.internalStore = new DataStoreHashMap_1.DataKeyedHashMap();
        this.ready = Util_1.DeferredPromise();
    }
    NearCacheImpl.prototype.setReady = function () {
        this.ready.resolve();
    };
    NearCacheImpl.prototype.getName = function () {
        return this.name;
    };
    NearCacheImpl.prototype.nextReservationId = function () {
        var res = this.reservationCounter;
        this.reservationCounter = this.reservationCounter.add(1);
        return res;
    };
    NearCacheImpl.prototype.tryReserveForUpdate = function (key) {
        var internalRecord = this.internalStore.get(key);
        var resId = this.nextReservationId();
        if (internalRecord === undefined) {
            this.doEvictionIfRequired();
            var dr = new DataRecord_1.DataRecord(key, undefined, undefined, this.timeToLiveSeconds);
            dr.casStatus(DataRecord_1.DataRecord.READ_PERMITTED, resId);
            this.internalStore.set(key, dr);
            return resId;
        }
        if (internalRecord.casStatus(DataRecord_1.DataRecord.READ_PERMITTED, resId)) {
            return resId;
        }
        return DataRecord_1.DataRecord.NOT_RESERVED;
    };
    NearCacheImpl.prototype.tryPublishReserved = function (key, value, reservationId) {
        var internalRecord = this.internalStore.get(key);
        if (internalRecord && internalRecord.casStatus(reservationId, DataRecord_1.DataRecord.READ_PERMITTED)) {
            if (this.inMemoryFormat === InMemoryFormat_1.InMemoryFormat.OBJECT) {
                internalRecord.value = this.serializationService.toObject(value);
            }
            else {
                internalRecord.value = this.serializationService.toData(value);
            }
            internalRecord.setCreationTime();
            this.initInvalidationMetadata(internalRecord);
        }
        else if (internalRecord === undefined) {
            return undefined;
        }
        else {
            if (this.inMemoryFormat === InMemoryFormat_1.InMemoryFormat.BINARY) {
                return this.serializationService.toObject(internalRecord.value);
            }
            else {
                return internalRecord.value;
            }
        }
    };
    NearCacheImpl.prototype.setStaleReadDetector = function (staleReadDetector) {
        this.staleReadDetector = staleReadDetector;
    };
    /**
     * Creates a new {DataRecord} for given key and value. Then, puts the record in near cache.
     * If the number of records in near cache exceeds {evictionMaxSize}, it removes expired items first.
     * If there is no expired item, it triggers an invalidation process to create free space.
     * @param key
     * @param value
     */
    NearCacheImpl.prototype.put = function (key, value) {
        this.doEvictionIfRequired();
        if (this.inMemoryFormat === InMemoryFormat_1.InMemoryFormat.OBJECT) {
            value = this.serializationService.toObject(value);
        }
        else {
            value = this.serializationService.toData(value);
        }
        var dr = new DataRecord_1.DataRecord(key, value, undefined, this.timeToLiveSeconds);
        this.initInvalidationMetadata(dr);
        this.internalStore.set(key, dr);
    };
    /**
     *
     * @param key
     * @returns the value if present in near cache, 'undefined' if not
     */
    NearCacheImpl.prototype.get = function (key) {
        var _this = this;
        return this.ready.promise.then(function () {
            var dr = _this.internalStore.get(key);
            if (dr === undefined) {
                _this.missCount++;
                return undefined;
            }
            if (_this.staleReadDetector.isStaleRead(key, dr)) {
                _this.internalStore.delete(key);
                _this.missCount++;
                return undefined;
            }
            if (dr.isExpired(_this.maxIdleSeconds)) {
                _this.expireRecord(key);
                _this.missCount++;
                return undefined;
            }
            dr.setAccessTime();
            dr.hitRecord();
            _this.hitCount++;
            if (_this.inMemoryFormat === InMemoryFormat_1.InMemoryFormat.BINARY) {
                return _this.serializationService.toObject(dr.value);
            }
            else {
                return dr.value;
            }
        });
    };
    NearCacheImpl.prototype.invalidate = function (key) {
        this.internalStore.delete(key);
    };
    NearCacheImpl.prototype.clear = function () {
        this.internalStore.clear();
    };
    NearCacheImpl.prototype.isInvalidatedOnChange = function () {
        return this.invalidateOnChange;
    };
    NearCacheImpl.prototype.getStatistics = function () {
        var stats = {
            creationTime: this.creationTime,
            evictedCount: this.evictedCount,
            expiredCount: this.expiredCount,
            missCount: this.missCount,
            hitCount: this.hitCount,
            entryCount: this.internalStore.size,
        };
        return stats;
    };
    NearCacheImpl.prototype.isEvictionRequired = function () {
        return this.evictionPolicy !== EvictionPolicy_1.EvictionPolicy.NONE && this.evictionMaxSize <= this.internalStore.size;
    };
    NearCacheImpl.prototype.doEvictionIfRequired = function () {
        if (!this.isEvictionRequired()) {
            return;
        }
        var internalSize = this.internalStore.size;
        if (this.recomputeEvictionPool() > 0) {
            return;
        }
        else {
            this.evictRecord(this.evictionCandidatePool[0].key);
            this.evictionCandidatePool = this.evictionCandidatePool.slice(1);
        }
    };
    /**
     * @returns number of expired elements.
     */
    NearCacheImpl.prototype.recomputeEvictionPool = function () {
        var arr = Array.from(this.internalStore.values());
        Util_1.shuffleArray(arr);
        var newCandidates = arr.slice(0, this.evictionSamplingCount);
        var cleanedNewCandidates = newCandidates.filter(this.filterExpiredRecord, this);
        var expiredCount = newCandidates.length - cleanedNewCandidates.length;
        if (expiredCount > 0) {
            return expiredCount;
        }
        (_a = this.evictionCandidatePool).push.apply(_a, cleanedNewCandidates);
        this.evictionCandidatePool.sort(this.compareFunc);
        this.evictionCandidatePool = this.evictionCandidatePool.slice(0, this.evictionSamplingPoolSize);
        return 0;
        var _a;
    };
    NearCacheImpl.prototype.filterExpiredRecord = function (candidate) {
        if (candidate.isExpired(this.maxIdleSeconds)) {
            this.expireRecord(candidate.key);
            return false;
        }
        else {
            return true;
        }
    };
    NearCacheImpl.prototype.expireRecord = function (key) {
        if (this.internalStore.delete(key)) {
            this.expiredCount++;
        }
    };
    NearCacheImpl.prototype.evictRecord = function (key) {
        if (this.internalStore.delete(key)) {
            this.evictedCount++;
        }
    };
    NearCacheImpl.prototype.initInvalidationMetadata = function (dr) {
        if (this.staleReadDetector === AlwaysFreshStaleReadDetectorImpl.INSTANCE) {
            return;
        }
        var partitionId = this.staleReadDetector.getPartitionId(dr.key);
        var metadataContainer = this.staleReadDetector.getMetadataContainer(partitionId);
        dr.setInvalidationSequence(metadataContainer.getSequence());
        dr.setUuid(metadataContainer.getUuid());
    };
    return NearCacheImpl;
}());
exports.NearCacheImpl = NearCacheImpl;
//# sourceMappingURL=NearCache.js.map