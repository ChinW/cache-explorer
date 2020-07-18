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
var MultiMapForceUnlockCodec_1 = require("../codec/MultiMapForceUnlockCodec");
var MultiMapIsLockedCodec_1 = require("../codec/MultiMapIsLockedCodec");
var MultiMapLockCodec_1 = require("../codec/MultiMapLockCodec");
var MultiMapTryLockCodec_1 = require("../codec/MultiMapTryLockCodec");
var MultiMapUnlockCodec_1 = require("../codec/MultiMapUnlockCodec");
var EventType_1 = require("../core/EventType");
var EntryListener_1 = require("../core/EntryListener");
var ReadOnlyLazyList_1 = require("../core/ReadOnlyLazyList");
var MultiMapAddEntryListenerCodec_1 = require("../codec/MultiMapAddEntryListenerCodec");
var MultiMapAddEntryListenerToKeyCodec_1 = require("../codec/MultiMapAddEntryListenerToKeyCodec");
var MultiMapClearCodec_1 = require("../codec/MultiMapClearCodec");
var MultiMapContainsEntryCodec_1 = require("../codec/MultiMapContainsEntryCodec");
var MultiMapContainsKeyCodec_1 = require("../codec/MultiMapContainsKeyCodec");
var MultiMapContainsValueCodec_1 = require("../codec/MultiMapContainsValueCodec");
var MultiMapEntrySetCodec_1 = require("../codec/MultiMapEntrySetCodec");
var MultiMapGetCodec_1 = require("../codec/MultiMapGetCodec");
var MultiMapKeySetCodec_1 = require("../codec/MultiMapKeySetCodec");
var MultiMapPutCodec_1 = require("../codec/MultiMapPutCodec");
var MultiMapRemoveCodec_1 = require("../codec/MultiMapRemoveCodec");
var MultiMapRemoveEntryCodec_1 = require("../codec/MultiMapRemoveEntryCodec");
var MultiMapRemoveEntryListenerCodec_1 = require("../codec/MultiMapRemoveEntryListenerCodec");
var MultiMapSizeCodec_1 = require("../codec/MultiMapSizeCodec");
var MultiMapValueCountCodec_1 = require("../codec/MultiMapValueCountCodec");
var MultiMapValuesCodec_1 = require("../codec/MultiMapValuesCodec");
var BaseProxy_1 = require("./BaseProxy");
var MapListener_1 = require("../core/MapListener");
var SerializationUtil = require("../serialization/SerializationUtil");
var MultiMapProxy = /** @class */ (function (_super) {
    __extends(MultiMapProxy, _super);
    function MultiMapProxy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lockReferenceIdGenerator = _this.client.getLockReferenceIdGenerator();
        _this.deserializeList = function (items) {
            return items.map(_this.toObject.bind(_this));
            // tslint:disable-next-line:semicolon
        };
        return _this;
    }
    /*tslint:disable:member-ordering*/
    MultiMapProxy.prototype.put = function (key, value) {
        var keyData = this.toData(key);
        var valueData = this.toData(value);
        return this.encodeInvokeOnKey(MultiMapPutCodec_1.MultiMapPutCodec, keyData, keyData, valueData, 1)
            .then(function (clientMessage) {
            var response = MultiMapPutCodec_1.MultiMapPutCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    MultiMapProxy.prototype.get = function (key) {
        var _this = this;
        var keyData = this.toData(key);
        return this.encodeInvokeOnKey(MultiMapGetCodec_1.MultiMapGetCodec, keyData, keyData, 1)
            .then(function (clientMessage) {
            var response = MultiMapGetCodec_1.MultiMapGetCodec.decodeResponse(clientMessage);
            return new ReadOnlyLazyList_1.ReadOnlyLazyList(response.response, _this.client.getSerializationService());
        });
    };
    MultiMapProxy.prototype.remove = function (key, value) {
        var keyData = this.toData(key);
        var valueData = this.toData(value);
        return this.encodeInvokeOnKey(MultiMapRemoveEntryCodec_1.MultiMapRemoveEntryCodec, keyData, keyData, valueData, 1)
            .then(function (clientMessage) {
            var response = MultiMapRemoveEntryCodec_1.MultiMapRemoveEntryCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    MultiMapProxy.prototype.removeAll = function (key) {
        var _this = this;
        var keyData = this.toData(key);
        return this.encodeInvokeOnKey(MultiMapRemoveCodec_1.MultiMapRemoveCodec, keyData, keyData, 1)
            .then(function (clientMessage) {
            var response = MultiMapRemoveCodec_1.MultiMapRemoveCodec.decodeResponse(clientMessage);
            return new ReadOnlyLazyList_1.ReadOnlyLazyList(response.response, _this.client.getSerializationService());
        });
    };
    MultiMapProxy.prototype.keySet = function () {
        var _this = this;
        return this.encodeInvokeOnRandomTarget(MultiMapKeySetCodec_1.MultiMapKeySetCodec)
            .then(function (clientMessage) {
            var response = MultiMapKeySetCodec_1.MultiMapKeySetCodec.decodeResponse(clientMessage);
            return _this.deserializeList(response.response);
        });
    };
    MultiMapProxy.prototype.values = function () {
        var _this = this;
        return this.encodeInvokeOnRandomTarget(MultiMapValuesCodec_1.MultiMapValuesCodec)
            .then(function (clientMessage) {
            var response = MultiMapValuesCodec_1.MultiMapValuesCodec.decodeResponse(clientMessage);
            return new ReadOnlyLazyList_1.ReadOnlyLazyList(response.response, _this.client.getSerializationService());
        });
    };
    MultiMapProxy.prototype.entrySet = function () {
        var _this = this;
        return this.encodeInvokeOnRandomTarget(MultiMapEntrySetCodec_1.MultiMapEntrySetCodec)
            .then(function (clientMessage) {
            var response = MultiMapEntrySetCodec_1.MultiMapEntrySetCodec.decodeResponse(clientMessage);
            return SerializationUtil.deserializeEntryList(_this.toObject.bind(_this), response.response);
        });
    };
    MultiMapProxy.prototype.containsKey = function (key) {
        var keyData = this.toData(key);
        return this.encodeInvokeOnKey(MultiMapContainsKeyCodec_1.MultiMapContainsKeyCodec, keyData, keyData, 1)
            .then(function (clientMessage) {
            var response = MultiMapContainsKeyCodec_1.MultiMapContainsKeyCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    MultiMapProxy.prototype.containsValue = function (value) {
        var valueData = this.toData(value);
        return this.encodeInvokeOnRandomTarget(MultiMapContainsValueCodec_1.MultiMapContainsValueCodec, valueData)
            .then(function (clientMessage) {
            var response = MultiMapContainsValueCodec_1.MultiMapContainsValueCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    MultiMapProxy.prototype.containsEntry = function (key, value) {
        var keyData = this.toData(key);
        var valueData = this.toData(value);
        return this.encodeInvokeOnKey(MultiMapContainsEntryCodec_1.MultiMapContainsEntryCodec, keyData, keyData, valueData, 1)
            .then(function (clientMessage) {
            var response = MultiMapContainsEntryCodec_1.MultiMapContainsEntryCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    MultiMapProxy.prototype.size = function () {
        return this.encodeInvokeOnRandomTarget(MultiMapSizeCodec_1.MultiMapSizeCodec)
            .then(function (clientMessage) {
            var response = MultiMapSizeCodec_1.MultiMapSizeCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    MultiMapProxy.prototype.clear = function () {
        return this.encodeInvokeOnRandomTarget(MultiMapClearCodec_1.MultiMapClearCodec)
            .then(function () { return undefined; });
    };
    MultiMapProxy.prototype.valueCount = function (key) {
        var keyData = this.toData(key);
        return this.encodeInvokeOnKey(MultiMapValueCountCodec_1.MultiMapValueCountCodec, keyData, keyData, 1)
            .then(function (clientMessage) {
            var response = MultiMapValueCountCodec_1.MultiMapValueCountCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    MultiMapProxy.prototype.addEntryListener = function (listener, key, includeValue) {
        var _this = this;
        if (includeValue === void 0) { includeValue = true; }
        var toObject = this.toObject.bind(this);
        /* tslint:disable: no-shadowed-variable */
        var entryEventHandler = function (keyData, valueData, oldValueData, mergingValueData, eventType, uuid, numberOfAffectedEntries) {
            var member = _this.client.getClusterService().getMember(uuid);
            var name = _this.name;
            key = toObject(keyData);
            var value = toObject(valueData);
            var oldValue = toObject(oldValueData);
            var mergingValue = toObject(mergingValueData);
            var entryEvent = new EntryListener_1.EntryEvent(name, key, value, oldValue, mergingValue, member);
            var mapEvent = new MapListener_1.MapEvent(name, numberOfAffectedEntries, member);
            // Multi map only supports these three event types
            switch (eventType) {
                case EventType_1.EventType.ADDED:
                    if (listener.added) {
                        listener.added.apply(null, [entryEvent]);
                    }
                    break;
                case EventType_1.EventType.REMOVED:
                    if (listener.removed) {
                        listener.removed.apply(null, [entryEvent]);
                    }
                    break;
                case EventType_1.EventType.CLEAR_ALL:
                    if (listener.mapCleared) {
                        listener.mapCleared.apply(null, [mapEvent]);
                    }
                    break;
            }
        };
        if (key) {
            var keyData = this.toData(key);
            var handler = function (m) {
                MultiMapAddEntryListenerToKeyCodec_1.MultiMapAddEntryListenerToKeyCodec.handle(m, entryEventHandler);
            };
            var codec = this.createEntryListenerToKey(this.name, keyData, includeValue);
            return this.client.getListenerService().registerListener(codec, handler);
        }
        else {
            var listenerHandler = function (m) {
                MultiMapAddEntryListenerCodec_1.MultiMapAddEntryListenerCodec.handle(m, entryEventHandler);
            };
            var codec = this.createEntryListener(this.name, includeValue);
            return this.client.getListenerService().registerListener(codec, listenerHandler);
        }
    };
    MultiMapProxy.prototype.removeEntryListener = function (listenerId) {
        return this.client.getListenerService().deregisterListener(listenerId);
    };
    MultiMapProxy.prototype.lock = function (key, leaseMillis) {
        if (leaseMillis === void 0) { leaseMillis = -1; }
        var keyData = this.toData(key);
        return this.encodeInvokeOnKey(MultiMapLockCodec_1.MultiMapLockCodec, keyData, keyData, 1, leaseMillis, this.nextSequence())
            .then(function () { return undefined; });
    };
    MultiMapProxy.prototype.isLocked = function (key) {
        var keyData = this.toData(key);
        return this.encodeInvokeOnKey(MultiMapIsLockedCodec_1.MultiMapIsLockedCodec, keyData, keyData)
            .then(function (clientMessage) {
            var response = MultiMapIsLockedCodec_1.MultiMapIsLockedCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    MultiMapProxy.prototype.tryLock = function (key, timeoutMillis, leaseMillis) {
        if (timeoutMillis === void 0) { timeoutMillis = 0; }
        if (leaseMillis === void 0) { leaseMillis = -1; }
        var keyData = this.toData(key);
        return this.encodeInvokeOnKey(MultiMapTryLockCodec_1.MultiMapTryLockCodec, keyData, keyData, 1, leaseMillis, timeoutMillis, this.nextSequence())
            .then(function (clientMessage) {
            var response = MultiMapTryLockCodec_1.MultiMapTryLockCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    MultiMapProxy.prototype.unlock = function (key) {
        var keyData = this.toData(key);
        return this.encodeInvokeOnKey(MultiMapUnlockCodec_1.MultiMapUnlockCodec, keyData, keyData, 1, this.nextSequence())
            .then(function () { return undefined; });
    };
    MultiMapProxy.prototype.forceUnlock = function (key) {
        var keyData = this.toData(key);
        return this.encodeInvokeOnKey(MultiMapForceUnlockCodec_1.MultiMapForceUnlockCodec, keyData, keyData, this.nextSequence())
            .then(function () { return undefined; });
    };
    MultiMapProxy.prototype.nextSequence = function () {
        return this.lockReferenceIdGenerator.getNextReferenceId();
    };
    MultiMapProxy.prototype.createEntryListenerToKey = function (name, keyData, includeValue) {
        return {
            encodeAddRequest: function (localOnly) {
                return MultiMapAddEntryListenerToKeyCodec_1.MultiMapAddEntryListenerToKeyCodec.encodeRequest(name, keyData, includeValue, localOnly);
            },
            decodeAddResponse: function (msg) {
                return MultiMapAddEntryListenerToKeyCodec_1.MultiMapAddEntryListenerToKeyCodec.decodeResponse(msg).response;
            },
            encodeRemoveRequest: function (listenerId) {
                return MultiMapRemoveEntryListenerCodec_1.MultiMapRemoveEntryListenerCodec.encodeRequest(name, listenerId);
            },
        };
    };
    MultiMapProxy.prototype.createEntryListener = function (name, includeValue) {
        return {
            encodeAddRequest: function (localOnly) {
                return MultiMapAddEntryListenerCodec_1.MultiMapAddEntryListenerCodec.encodeRequest(name, includeValue, localOnly);
            },
            decodeAddResponse: function (msg) {
                return MultiMapAddEntryListenerCodec_1.MultiMapAddEntryListenerCodec.decodeResponse(msg).response;
            },
            encodeRemoveRequest: function (listenerId) {
                return MultiMapRemoveEntryListenerCodec_1.MultiMapRemoveEntryListenerCodec.encodeRequest(name, listenerId);
            },
        };
    };
    return MultiMapProxy;
}(BaseProxy_1.BaseProxy));
exports.MultiMapProxy = MultiMapProxy;
//# sourceMappingURL=MultiMapProxy.js.map