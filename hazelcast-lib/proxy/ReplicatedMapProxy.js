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
var ReplicatedMapAddEntryListenerCodec_1 = require("../codec/ReplicatedMapAddEntryListenerCodec");
var ReplicatedMapAddEntryListenerToKeyCodec_1 = require("../codec/ReplicatedMapAddEntryListenerToKeyCodec");
/* tslint:disable:max-line-length */
var ReplicatedMapAddEntryListenerToKeyWithPredicateCodec_1 = require("../codec/ReplicatedMapAddEntryListenerToKeyWithPredicateCodec");
var ReplicatedMapAddEntryListenerWithPredicateCodec_1 = require("../codec/ReplicatedMapAddEntryListenerWithPredicateCodec");
var ReplicatedMapClearCodec_1 = require("../codec/ReplicatedMapClearCodec");
var ReplicatedMapContainsKeyCodec_1 = require("../codec/ReplicatedMapContainsKeyCodec");
var ReplicatedMapContainsValueCodec_1 = require("../codec/ReplicatedMapContainsValueCodec");
var ReplicatedMapEntrySetCodec_1 = require("../codec/ReplicatedMapEntrySetCodec");
var ReplicatedMapGetCodec_1 = require("../codec/ReplicatedMapGetCodec");
var ReplicatedMapIsEmptyCodec_1 = require("../codec/ReplicatedMapIsEmptyCodec");
var ReplicatedMapKeySetCodec_1 = require("../codec/ReplicatedMapKeySetCodec");
var ReplicatedMapPutAllCodec_1 = require("../codec/ReplicatedMapPutAllCodec");
var ReplicatedMapPutCodec_1 = require("../codec/ReplicatedMapPutCodec");
var ReplicatedMapRemoveCodec_1 = require("../codec/ReplicatedMapRemoveCodec");
var ReplicatedMapRemoveEntryListenerCodec_1 = require("../codec/ReplicatedMapRemoveEntryListenerCodec");
var ReplicatedMapSizeCodec_1 = require("../codec/ReplicatedMapSizeCodec");
var ReplicatedMapValuesCodec_1 = require("../codec/ReplicatedMapValuesCodec");
var EventType_1 = require("../core/EventType");
var EntryListener_1 = require("../core/EntryListener");
var ReadOnlyLazyList_1 = require("../core/ReadOnlyLazyList");
var Util_1 = require("../Util");
var PartitionSpecificProxy_1 = require("./PartitionSpecificProxy");
var MapListener_1 = require("../core/MapListener");
var SerializationUtil = require("../serialization/SerializationUtil");
var ReplicatedMapProxy = /** @class */ (function (_super) {
    __extends(ReplicatedMapProxy, _super);
    function ReplicatedMapProxy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReplicatedMapProxy.prototype.put = function (key, value, ttl) {
        var _this = this;
        if (ttl === void 0) { ttl = 0; }
        Util_1.assertNotNull(key);
        Util_1.assertNotNull(value);
        var valueData = this.toData(value);
        var keyData = this.toData(key);
        return this.encodeInvokeOnKey(ReplicatedMapPutCodec_1.ReplicatedMapPutCodec, keyData, keyData, valueData, ttl)
            .then(function (clientMessage) {
            var response = ReplicatedMapPutCodec_1.ReplicatedMapPutCodec.decodeResponse(clientMessage);
            return _this.toObject(response.response);
        });
    };
    ReplicatedMapProxy.prototype.clear = function () {
        return this.encodeInvokeOnRandomTarget(ReplicatedMapClearCodec_1.ReplicatedMapClearCodec)
            .then(function () { return undefined; });
    };
    ReplicatedMapProxy.prototype.get = function (key) {
        var _this = this;
        Util_1.assertNotNull(key);
        var keyData = this.toData(key);
        return this.encodeInvokeOnKey(ReplicatedMapGetCodec_1.ReplicatedMapGetCodec, keyData, keyData)
            .then(function (clientMessage) {
            var response = ReplicatedMapGetCodec_1.ReplicatedMapGetCodec.decodeResponse(clientMessage);
            return _this.toObject(response.response);
        });
    };
    ReplicatedMapProxy.prototype.containsKey = function (key) {
        Util_1.assertNotNull(key);
        var keyData = this.toData(key);
        return this.encodeInvokeOnKey(ReplicatedMapContainsKeyCodec_1.ReplicatedMapContainsKeyCodec, keyData, keyData)
            .then(function (clientMessage) {
            var response = ReplicatedMapContainsKeyCodec_1.ReplicatedMapContainsKeyCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    ReplicatedMapProxy.prototype.containsValue = function (value) {
        Util_1.assertNotNull(value);
        var valueData = this.toData(value);
        return this.encodeInvoke(ReplicatedMapContainsValueCodec_1.ReplicatedMapContainsValueCodec, valueData)
            .then(function (clientMessage) {
            var response = ReplicatedMapContainsValueCodec_1.ReplicatedMapContainsValueCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    ReplicatedMapProxy.prototype.size = function () {
        return this.encodeInvoke(ReplicatedMapSizeCodec_1.ReplicatedMapSizeCodec)
            .then(function (clientMessage) {
            var response = ReplicatedMapSizeCodec_1.ReplicatedMapSizeCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    ReplicatedMapProxy.prototype.isEmpty = function () {
        return this.encodeInvoke(ReplicatedMapIsEmptyCodec_1.ReplicatedMapIsEmptyCodec)
            .then(function (clientMessage) {
            var response = ReplicatedMapIsEmptyCodec_1.ReplicatedMapIsEmptyCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    ReplicatedMapProxy.prototype.remove = function (key) {
        var _this = this;
        Util_1.assertNotNull(key);
        var keyData = this.toData(key);
        return this.encodeInvokeOnKey(ReplicatedMapRemoveCodec_1.ReplicatedMapRemoveCodec, keyData, keyData)
            .then(function (clientMessage) {
            var response = ReplicatedMapRemoveCodec_1.ReplicatedMapRemoveCodec.decodeResponse(clientMessage);
            return _this.toObject(response.response);
        });
    };
    ReplicatedMapProxy.prototype.putAll = function (pairs) {
        var pair;
        var pairId;
        var entries = [];
        for (pairId in pairs) {
            pair = pairs[pairId];
            var keyData = this.toData(pair[0]);
            var valueData = this.toData(pair[1]);
            entries.push([keyData, valueData]);
        }
        return this.encodeInvokeOnRandomTarget(ReplicatedMapPutAllCodec_1.ReplicatedMapPutAllCodec, entries)
            .then(function () { return undefined; });
    };
    ReplicatedMapProxy.prototype.keySet = function () {
        var toObject = this.toObject.bind(this);
        return this.encodeInvoke(ReplicatedMapKeySetCodec_1.ReplicatedMapKeySetCodec)
            .then(function (clientMessage) {
            var response = ReplicatedMapKeySetCodec_1.ReplicatedMapKeySetCodec.decodeResponse(clientMessage);
            return response.response.map(toObject);
        });
    };
    ReplicatedMapProxy.prototype.values = function (comparator) {
        var _this = this;
        return this.encodeInvoke(ReplicatedMapValuesCodec_1.ReplicatedMapValuesCodec)
            .then(function (clientMessage) {
            var response = ReplicatedMapValuesCodec_1.ReplicatedMapValuesCodec.decodeResponse(clientMessage);
            var valuesData = response.response;
            if (comparator) {
                var desValues = valuesData.map(_this.toObject.bind(_this));
                return new ReadOnlyLazyList_1.ReadOnlyLazyList(desValues.sort(comparator), _this.client.getSerializationService());
            }
            return new ReadOnlyLazyList_1.ReadOnlyLazyList(valuesData, _this.client.getSerializationService());
        });
    };
    ReplicatedMapProxy.prototype.entrySet = function () {
        var _this = this;
        return this.encodeInvoke(ReplicatedMapEntrySetCodec_1.ReplicatedMapEntrySetCodec)
            .then(function (clientMessage) {
            var response = ReplicatedMapEntrySetCodec_1.ReplicatedMapEntrySetCodec.decodeResponse(clientMessage);
            return SerializationUtil.deserializeEntryList(_this.toObject.bind(_this), response.response);
        });
    };
    ReplicatedMapProxy.prototype.addEntryListenerToKeyWithPredicate = function (listener, key, predicate) {
        return this.addEntryListenerInternal(listener, predicate, key);
    };
    ReplicatedMapProxy.prototype.addEntryListenerWithPredicate = function (listener, predicate) {
        return this.addEntryListenerInternal(listener, predicate, undefined);
    };
    ReplicatedMapProxy.prototype.addEntryListenerToKey = function (listener, key) {
        return this.addEntryListenerInternal(listener, undefined, key);
    };
    ReplicatedMapProxy.prototype.addEntryListener = function (listener) {
        return this.addEntryListenerInternal(listener, undefined, undefined);
    };
    ReplicatedMapProxy.prototype.removeEntryListener = function (listenerId) {
        return this.client.getListenerService().deregisterListener(listenerId);
    };
    ReplicatedMapProxy.prototype.addEntryListenerInternal = function (listener, predicate, key) {
        var _this = this;
        var toObject = this.toObject.bind(this);
        /* tslint:disable-next-line:no-shadowed-variable */
        var entryEventHandler = function (key, value, oldValue, mergingValue, event, uuid, numberOfAffectedEntries) {
            var member = _this.client.getClusterService().getMember(uuid);
            var name = _this.name;
            key = toObject(key);
            value = toObject(value);
            oldValue = toObject(oldValue);
            mergingValue = toObject(mergingValue);
            var entryEvent = new EntryListener_1.EntryEvent(name, key, value, oldValue, mergingValue, member);
            var mapEvent = new MapListener_1.MapEvent(name, numberOfAffectedEntries, member);
            var entryEventToListenerMap = (_a = {},
                _a[EventType_1.EventType.ADDED] = 'added',
                _a[EventType_1.EventType.REMOVED] = 'removed',
                _a[EventType_1.EventType.UPDATED] = 'updated',
                _a[EventType_1.EventType.EVICTED] = 'evicted',
                _a);
            var mapEventToListenerMap = (_b = {},
                _b[EventType_1.EventType.CLEAR_ALL] = 'mapCleared',
                _b);
            var entryEventMethod = entryEventToListenerMap[event];
            var mapEventMethod = mapEventToListenerMap[event];
            if (listener.hasOwnProperty(entryEventMethod)) {
                listener[entryEventMethod].apply(null, [entryEvent]);
            }
            else if (listener.hasOwnProperty(mapEventMethod)) {
                listener[mapEventMethod].apply(null, [mapEvent]);
            }
            var _a, _b;
        };
        var listenerHandler;
        var codec;
        if (key && predicate) {
            var keyData = this.toData(key);
            var predicateData = this.toData(predicate);
            codec = this.createEntryListenerToKeyWithPredicate(this.name, keyData, predicateData);
            listenerHandler = ReplicatedMapAddEntryListenerToKeyWithPredicateCodec_1.ReplicatedMapAddEntryListenerToKeyWithPredicateCodec.handle;
        }
        else if (key && !predicate) {
            var keyData = this.toData(key);
            codec = this.createEntryListenerToKey(this.name, keyData);
            listenerHandler = ReplicatedMapAddEntryListenerToKeyCodec_1.ReplicatedMapAddEntryListenerToKeyCodec.handle;
        }
        else if (!key && predicate) {
            var predicateData = this.toData(predicate);
            codec = this.createEntryListenerWithPredicate(this.name, predicateData);
            listenerHandler = ReplicatedMapAddEntryListenerWithPredicateCodec_1.ReplicatedMapAddEntryListenerWithPredicateCodec.handle;
        }
        else {
            codec = this.createEntryListener(this.name);
            listenerHandler = ReplicatedMapAddEntryListenerCodec_1.ReplicatedMapAddEntryListenerCodec.handle;
        }
        return this.client.getListenerService().registerListener(codec, function (m) {
            listenerHandler(m, entryEventHandler, toObject);
        });
    };
    ReplicatedMapProxy.prototype.createEntryListener = function (name) {
        return {
            encodeAddRequest: function (localOnly) {
                return ReplicatedMapAddEntryListenerCodec_1.ReplicatedMapAddEntryListenerCodec.encodeRequest(name, localOnly);
            },
            decodeAddResponse: function (msg) {
                return ReplicatedMapAddEntryListenerCodec_1.ReplicatedMapAddEntryListenerCodec.decodeResponse(msg).response;
            },
            encodeRemoveRequest: function (listenerId) {
                return ReplicatedMapRemoveEntryListenerCodec_1.ReplicatedMapRemoveEntryListenerCodec.encodeRequest(name, listenerId);
            },
        };
    };
    ReplicatedMapProxy.prototype.createEntryListenerToKey = function (name, keyData) {
        return {
            encodeAddRequest: function (localOnly) {
                return ReplicatedMapAddEntryListenerToKeyCodec_1.ReplicatedMapAddEntryListenerToKeyCodec.encodeRequest(name, keyData, localOnly);
            },
            decodeAddResponse: function (msg) {
                return ReplicatedMapAddEntryListenerToKeyCodec_1.ReplicatedMapAddEntryListenerToKeyCodec.decodeResponse(msg).response;
            },
            encodeRemoveRequest: function (listenerId) {
                return ReplicatedMapRemoveEntryListenerCodec_1.ReplicatedMapRemoveEntryListenerCodec.encodeRequest(name, listenerId);
            },
        };
    };
    ReplicatedMapProxy.prototype.createEntryListenerWithPredicate = function (name, predicateData) {
        return {
            encodeAddRequest: function (localOnly) {
                return ReplicatedMapAddEntryListenerWithPredicateCodec_1.ReplicatedMapAddEntryListenerWithPredicateCodec.encodeRequest(name, predicateData, localOnly);
            },
            decodeAddResponse: function (msg) {
                return ReplicatedMapAddEntryListenerWithPredicateCodec_1.ReplicatedMapAddEntryListenerWithPredicateCodec.decodeResponse(msg).response;
            },
            encodeRemoveRequest: function (listenerId) {
                return ReplicatedMapRemoveEntryListenerCodec_1.ReplicatedMapRemoveEntryListenerCodec.encodeRequest(name, listenerId);
            },
        };
    };
    ReplicatedMapProxy.prototype.createEntryListenerToKeyWithPredicate = function (name, keyData, predicateData) {
        return {
            encodeAddRequest: function (localOnly) {
                return ReplicatedMapAddEntryListenerToKeyWithPredicateCodec_1.ReplicatedMapAddEntryListenerToKeyWithPredicateCodec.encodeRequest(name, keyData, predicateData, localOnly);
            },
            decodeAddResponse: function (msg) {
                return ReplicatedMapAddEntryListenerToKeyWithPredicateCodec_1.ReplicatedMapAddEntryListenerToKeyWithPredicateCodec.decodeResponse(msg).response;
            },
            encodeRemoveRequest: function (listenerId) {
                return ReplicatedMapRemoveEntryListenerCodec_1.ReplicatedMapRemoveEntryListenerCodec.encodeRequest(name, listenerId);
            },
        };
    };
    return ReplicatedMapProxy;
}(PartitionSpecificProxy_1.PartitionSpecificProxy));
exports.ReplicatedMapProxy = ReplicatedMapProxy;
//# sourceMappingURL=ReplicatedMapProxy.js.map