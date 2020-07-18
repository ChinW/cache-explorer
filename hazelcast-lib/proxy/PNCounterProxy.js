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
var Long = require("long");
var PNCounterAddCodec_1 = require("../codec/PNCounterAddCodec");
var PNCounterGetCodec_1 = require("../codec/PNCounterGetCodec");
var PNCounterGetConfiguredReplicaCountCodec_1 = require("../codec/PNCounterGetConfiguredReplicaCountCodec");
var MemberSelectors_1 = require("../core/MemberSelectors");
var VectorClock_1 = require("../core/VectorClock");
var HazelcastError_1 = require("../HazelcastError");
var Util_1 = require("../Util");
var BaseProxy_1 = require("./BaseProxy");
var PNCounterProxy = /** @class */ (function (_super) {
    __extends(PNCounterProxy, _super);
    function PNCounterProxy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lastObservedVectorClock = new VectorClock_1.VectorClock();
        _this.maximumReplicaCount = 0;
        return _this;
    }
    PNCounterProxy.prototype.get = function () {
        return this.invokeInternal(PNCounterProxy.EMPTY_ARRAY, null, PNCounterGetCodec_1.PNCounterGetCodec);
    };
    PNCounterProxy.prototype.getAndAdd = function (delta) {
        return this.invokeInternal(PNCounterProxy.EMPTY_ARRAY, null, PNCounterAddCodec_1.PNCounterAddCodec, delta, true);
    };
    PNCounterProxy.prototype.addAndGet = function (delta) {
        return this.invokeInternal(PNCounterProxy.EMPTY_ARRAY, null, PNCounterAddCodec_1.PNCounterAddCodec, delta, false);
    };
    PNCounterProxy.prototype.getAndSubtract = function (delta) {
        if (!Long.isLong(delta)) {
            delta = Long.fromNumber(delta);
        }
        return this.invokeInternal(PNCounterProxy.EMPTY_ARRAY, null, PNCounterAddCodec_1.PNCounterAddCodec, delta.neg(), true);
    };
    PNCounterProxy.prototype.subtractAndGet = function (delta) {
        if (!Long.isLong(delta)) {
            delta = Long.fromNumber(delta);
        }
        return this.invokeInternal(PNCounterProxy.EMPTY_ARRAY, null, PNCounterAddCodec_1.PNCounterAddCodec, delta.neg(), false);
    };
    PNCounterProxy.prototype.decrementAndGet = function () {
        return this.invokeInternal(PNCounterProxy.EMPTY_ARRAY, null, PNCounterAddCodec_1.PNCounterAddCodec, Long.fromNumber(-1), false);
    };
    PNCounterProxy.prototype.incrementAndGet = function () {
        return this.invokeInternal(PNCounterProxy.EMPTY_ARRAY, null, PNCounterAddCodec_1.PNCounterAddCodec, Long.fromNumber(1), false);
    };
    PNCounterProxy.prototype.getAndDecrement = function () {
        return this.invokeInternal(PNCounterProxy.EMPTY_ARRAY, null, PNCounterAddCodec_1.PNCounterAddCodec, Long.fromNumber(-1), true);
    };
    PNCounterProxy.prototype.getAndIncrement = function () {
        return this.invokeInternal(PNCounterProxy.EMPTY_ARRAY, null, PNCounterAddCodec_1.PNCounterAddCodec, Long.fromNumber(1), true);
    };
    PNCounterProxy.prototype.reset = function () {
        this.lastObservedVectorClock = new VectorClock_1.VectorClock();
        return Promise.resolve();
    };
    PNCounterProxy.prototype.invokeInternal = function (excludedAddresses, lastError, codec) {
        var _this = this;
        var codecArgs = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            codecArgs[_i - 3] = arguments[_i];
        }
        return this.getCRDTOperationTarget(excludedAddresses).then(function (target) {
            if (target == null) {
                if (lastError) {
                    throw lastError;
                }
                else {
                    throw new HazelcastError_1.NoDataMemberInClusterError('Cannot invoke operations on a CRDT ' +
                        'because the cluster does not contain any data members');
                }
            }
            return _this.encodeInvokeInternal.apply(_this, [target, codec].concat(codecArgs)).then(function (result) {
                _this.updateObservedReplicaTimestamps(result.replicaTimestamps);
                return result.value;
            }).catch(function (err) {
                if (excludedAddresses === PNCounterProxy.EMPTY_ARRAY) {
                    excludedAddresses = [];
                }
                excludedAddresses.push(target);
                return _this.invokeInternal.apply(_this, [excludedAddresses, err, codec].concat(codecArgs));
            });
        });
    };
    PNCounterProxy.prototype.encodeInvokeInternal = function (target, codec) {
        var codecArguments = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            codecArguments[_i - 2] = arguments[_i];
        }
        return this.encodeInvokeOnTarget.apply(this, [codec, target.uuid].concat(codecArguments, [this.lastObservedVectorClock.entrySet(), target.uuid])).then(function (clientMessage) {
            return codec.decodeResponse(clientMessage);
        });
    };
    PNCounterProxy.prototype.getCRDTOperationTarget = function (excludedAddresses) {
        var _this = this;
        if (this.currentTargetReplicaAddress != null &&
            !excludedAddresses.some(this.currentTargetReplicaAddress.equals.bind(this.currentTargetReplicaAddress))) {
            return Promise.resolve(this.currentTargetReplicaAddress);
        }
        else {
            return this.chooseTargetReplica(excludedAddresses).then(function (target) {
                _this.currentTargetReplicaAddress = target;
                return target;
            });
        }
    };
    PNCounterProxy.prototype.chooseTargetReplica = function (excludedAddresses) {
        return this.getReplicaAddresses(excludedAddresses).then(function (replicaAddresses) {
            if (replicaAddresses.length === 0) {
                return null;
            }
            return replicaAddresses[Util_1.randomInt(replicaAddresses.length)];
        });
    };
    PNCounterProxy.prototype.getReplicaAddresses = function (excludedAddresses) {
        var dataMembers = this.client.getClusterService().getMembers(MemberSelectors_1.MemberSelectors.DATA_MEMBER_SELECTOR);
        return this.getMaxConfiguredReplicaCount().then(function (replicaCount) {
            var currentCount = Math.min(replicaCount, dataMembers.length);
            var replicaAddresses = [];
            for (var i = 0; i < currentCount; i++) {
                var memberAddress = dataMembers[i];
                if (!excludedAddresses.some(memberAddress.equals.bind(memberAddress))) {
                    replicaAddresses.push(memberAddress);
                }
            }
            return replicaAddresses;
        });
    };
    PNCounterProxy.prototype.getMaxConfiguredReplicaCount = function () {
        var _this = this;
        if (this.maximumReplicaCount > 0) {
            return Promise.resolve(this.maximumReplicaCount);
        }
        else {
            return this.encodeInvokeOnRandomTarget(PNCounterGetConfiguredReplicaCountCodec_1.PNCounterGetConfiguredReplicaCountCodec)
                .then(function (clientMessage) {
                var response = PNCounterGetConfiguredReplicaCountCodec_1.PNCounterGetConfiguredReplicaCountCodec.decodeResponse(clientMessage);
                _this.maximumReplicaCount = response.response;
                return _this.maximumReplicaCount;
            });
        }
    };
    PNCounterProxy.prototype.updateObservedReplicaTimestamps = function (observedTimestamps) {
        var observedClock = this.toVectorClock(observedTimestamps);
        if (observedClock.isAfter(this.lastObservedVectorClock)) {
            this.lastObservedVectorClock = observedClock;
        }
    };
    PNCounterProxy.prototype.toVectorClock = function (timestamps) {
        var vectorClock = new VectorClock_1.VectorClock();
        timestamps.forEach(function (entry) {
            vectorClock.setReplicaTimestamp(entry[0], entry[1]);
        });
        return vectorClock;
    };
    PNCounterProxy.EMPTY_ARRAY = [];
    return PNCounterProxy;
}(BaseProxy_1.BaseProxy));
exports.PNCounterProxy = PNCounterProxy;
//# sourceMappingURL=PNCounterProxy.js.map