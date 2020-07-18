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
var MetadataContainer = /** @class */ (function () {
    function MetadataContainer() {
        this.sequence = Long.fromNumber(0);
        this.staleSequence = Long.fromNumber(0);
        this.missedSequenceCount = Long.fromNumber(0);
    }
    MetadataContainer.prototype.reset = function () {
        this.sequence = Long.fromNumber(0);
        this.staleSequence = Long.fromNumber(0);
        this.missedSequenceCount = Long.fromNumber(0);
    };
    MetadataContainer.prototype.setSequence = function (sequence) {
        this.sequence = sequence;
    };
    MetadataContainer.prototype.getSequence = function () {
        return this.sequence;
    };
    MetadataContainer.prototype.setStaleSequence = function (staleSequence) {
        this.staleSequence = staleSequence;
    };
    MetadataContainer.prototype.getStaleSequence = function () {
        return this.staleSequence;
    };
    MetadataContainer.prototype.increaseMissedSequenceCount = function (missed) {
        this.missedSequenceCount = this.missedSequenceCount.add(missed);
    };
    MetadataContainer.prototype.getMissedSequenceCount = function () {
        return this.missedSequenceCount;
    };
    MetadataContainer.prototype.setUuid = function (uuid) {
        this.uuid = uuid;
    };
    MetadataContainer.prototype.getUuid = function () {
        return this.uuid;
    };
    return MetadataContainer;
}());
exports.MetadataContainer = MetadataContainer;
//# sourceMappingURL=MetadataContainer.js.map