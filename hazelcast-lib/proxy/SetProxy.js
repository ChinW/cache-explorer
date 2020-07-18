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
var SetAddAllCodec_1 = require("../codec/SetAddAllCodec");
var SetAddCodec_1 = require("../codec/SetAddCodec");
var SetAddListenerCodec_1 = require("../codec/SetAddListenerCodec");
var SetClearCodec_1 = require("../codec/SetClearCodec");
var SetCompareAndRemoveAllCodec_1 = require("../codec/SetCompareAndRemoveAllCodec");
var SetCompareAndRetainAllCodec_1 = require("../codec/SetCompareAndRetainAllCodec");
var SetContainsAllCodec_1 = require("../codec/SetContainsAllCodec");
var SetContainsCodec_1 = require("../codec/SetContainsCodec");
var SetGetAllCodec_1 = require("../codec/SetGetAllCodec");
var SetIsEmptyCodec_1 = require("../codec/SetIsEmptyCodec");
var SetRemoveCodec_1 = require("../codec/SetRemoveCodec");
var SetRemoveListenerCodec_1 = require("../codec/SetRemoveListenerCodec");
var SetSizeCodec_1 = require("../codec/SetSizeCodec");
var ItemListener_1 = require("../core/ItemListener");
var PartitionSpecificProxy_1 = require("./PartitionSpecificProxy");
var SetProxy = /** @class */ (function (_super) {
    __extends(SetProxy, _super);
    function SetProxy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SetProxy.prototype.add = function (entry) {
        return this.encodeInvoke(SetAddCodec_1.SetAddCodec, this.toData(entry))
            .then(function (clientMessage) {
            var response = SetAddCodec_1.SetAddCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    SetProxy.prototype.addAll = function (items) {
        return this.encodeInvoke(SetAddAllCodec_1.SetAddAllCodec, this.serializeList(items))
            .then(function (clientMessage) {
            var response = SetAddAllCodec_1.SetAddAllCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    SetProxy.prototype.toArray = function () {
        var _this = this;
        return this.encodeInvoke(SetGetAllCodec_1.SetGetAllCodec)
            .then(function (clientMessage) {
            var response = SetGetAllCodec_1.SetGetAllCodec.decodeResponse(clientMessage);
            return response.response.map(_this.toObject.bind(_this));
        });
    };
    SetProxy.prototype.clear = function () {
        return this.encodeInvoke(SetClearCodec_1.SetClearCodec)
            .then(function () { return undefined; });
    };
    SetProxy.prototype.contains = function (entry) {
        return this.encodeInvoke(SetContainsCodec_1.SetContainsCodec, this.toData(entry))
            .then(function (clientMessage) {
            var response = SetContainsCodec_1.SetContainsCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    SetProxy.prototype.containsAll = function (items) {
        return this.encodeInvoke(SetContainsAllCodec_1.SetContainsAllCodec, this.serializeList(items))
            .then(function (clientMessage) {
            var response = SetContainsAllCodec_1.SetContainsAllCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    SetProxy.prototype.isEmpty = function () {
        return this.encodeInvoke(SetIsEmptyCodec_1.SetIsEmptyCodec)
            .then(function (clientMessage) {
            var response = SetIsEmptyCodec_1.SetIsEmptyCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    SetProxy.prototype.remove = function (entry) {
        return this.encodeInvoke(SetRemoveCodec_1.SetRemoveCodec, this.toData(entry))
            .then(function (clientMessage) {
            var response = SetRemoveCodec_1.SetRemoveCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    SetProxy.prototype.removeAll = function (items) {
        return this.encodeInvoke(SetCompareAndRemoveAllCodec_1.SetCompareAndRemoveAllCodec, this.serializeList(items))
            .then(function (clientMessage) {
            var response = SetCompareAndRemoveAllCodec_1.SetCompareAndRemoveAllCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    SetProxy.prototype.retainAll = function (items) {
        return this.encodeInvoke(SetCompareAndRetainAllCodec_1.SetCompareAndRetainAllCodec, this.serializeList(items))
            .then(function (clientMessage) {
            var response = SetCompareAndRetainAllCodec_1.SetCompareAndRetainAllCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    SetProxy.prototype.size = function () {
        return this.encodeInvoke(SetSizeCodec_1.SetSizeCodec)
            .then(function (clientMessage) {
            var response = SetSizeCodec_1.SetSizeCodec.decodeResponse(clientMessage);
            return response.response;
        });
    };
    SetProxy.prototype.addItemListener = function (listener, includeValue) {
        var _this = this;
        if (includeValue === void 0) { includeValue = true; }
        var handler = function (message) {
            SetAddListenerCodec_1.SetAddListenerCodec.handle(message, function (item, uuid, eventType) {
                var responseObject = _this.toObject(item);
                var member = _this.client.getClusterService().getMember(uuid);
                var name = _this.name;
                var itemEvent = new ItemListener_1.ItemEvent(name, eventType, responseObject, member);
                if (eventType === ItemListener_1.ItemEventType.ADDED && listener.itemAdded) {
                    listener.itemAdded.apply(null, [itemEvent]);
                }
                else if (eventType === ItemListener_1.ItemEventType.REMOVED && listener.itemRemoved) {
                    listener.itemRemoved.apply(null, [itemEvent]);
                }
            });
        };
        var codec = this.createEntryListener(this.name, includeValue);
        return this.client.getListenerService().registerListener(codec, handler);
    };
    SetProxy.prototype.removeItemListener = function (registrationId) {
        return this.client.getListenerService().deregisterListener(registrationId);
    };
    SetProxy.prototype.serializeList = function (input) {
        var _this = this;
        return input.map(function (each) {
            return _this.toData(each);
        });
    };
    SetProxy.prototype.createEntryListener = function (name, includeValue) {
        return {
            encodeAddRequest: function (localOnly) {
                return SetAddListenerCodec_1.SetAddListenerCodec.encodeRequest(name, includeValue, localOnly);
            },
            decodeAddResponse: function (msg) {
                return SetAddListenerCodec_1.SetAddListenerCodec.decodeResponse(msg).response;
            },
            encodeRemoveRequest: function (listenerId) {
                return SetRemoveListenerCodec_1.SetRemoveListenerCodec.encodeRequest(name, listenerId);
            },
        };
    };
    return SetProxy;
}(PartitionSpecificProxy_1.PartitionSpecificProxy));
exports.SetProxy = SetProxy;
//# sourceMappingURL=SetProxy.js.map