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
var DataRecord = /** @class */ (function () {
    function DataRecord(key, value, creationTime, ttl) {
        this.key = key;
        this.value = value;
        this.ttl = ttl;
        if (creationTime) {
            this.creationTime = creationTime;
        }
        else {
            this.creationTime = Date.now();
        }
        if (ttl) {
            this.expirationTime = this.creationTime + ttl * 1000;
        }
        else {
            this.expirationTime = undefined;
        }
        this.lastAccessTime = this.creationTime;
        this.accessHit = 0;
        this.invalidationSequence = Long.fromNumber(0);
        this.uuid = null;
        this.status = DataRecord.READ_PERMITTED;
    }
    /*tslint:disable:member-ordering*/
    DataRecord.lruComp = function (x, y) {
        return x.lastAccessTime - y.lastAccessTime;
    };
    DataRecord.lfuComp = function (x, y) {
        return x.accessHit - y.accessHit;
    };
    DataRecord.randomComp = function (x, y) {
        return Math.random() - 0.5;
    };
    DataRecord.prototype.isExpired = function (maxIdleSeconds) {
        var now = Date.now();
        if ((this.expirationTime > 0 && this.expirationTime < now) ||
            (maxIdleSeconds > 0 && this.lastAccessTime + maxIdleSeconds * 1000 < now)) {
            return true;
        }
        else {
            return false;
        }
    };
    DataRecord.prototype.setAccessTime = function () {
        this.lastAccessTime = Date.now();
    };
    DataRecord.prototype.hitRecord = function () {
        this.accessHit++;
    };
    DataRecord.prototype.getInvalidationSequence = function () {
        return this.invalidationSequence;
    };
    DataRecord.prototype.setInvalidationSequence = function (sequence) {
        this.invalidationSequence = sequence;
    };
    DataRecord.prototype.hasSameUuid = function (uuid) {
        return uuid != null && this.uuid != null && this.uuid.equals(uuid);
    };
    DataRecord.prototype.setUuid = function (uuid) {
        this.uuid = uuid;
    };
    DataRecord.prototype.casStatus = function (expected, update) {
        if (expected.equals(this.status)) {
            this.status = update;
            return true;
        }
        return false;
    };
    DataRecord.prototype.getStatus = function () {
        return this.status;
    };
    DataRecord.prototype.setCreationTime = function (creationTime) {
        if (creationTime) {
            this.creationTime = creationTime;
        }
        else {
            this.creationTime = Date.now();
        }
        if (this.ttl) {
            this.expirationTime = this.creationTime + this.ttl * 1000;
        }
        else {
            this.expirationTime = undefined;
        }
    };
    DataRecord.NOT_RESERVED = Long.NEG_ONE;
    DataRecord.RESERVED = Long.fromNumber(-2);
    DataRecord.READ_PERMITTED = Long.fromNumber(-3);
    return DataRecord;
}());
exports.DataRecord = DataRecord;
//# sourceMappingURL=DataRecord.js.map