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
/*tslint:disable:max-line-length*/
var BitsUtil_1 = require("../BitsUtil");
var FixSizedTypesCodec_1 = require("./builtin/FixSizedTypesCodec");
var ClientMessage_1 = require("../ClientMessage");
var StringCodec_1 = require("./builtin/StringCodec");
// hex: 0x000900
var REQUEST_MESSAGE_TYPE = 2304;
// hex: 0x000901
var RESPONSE_MESSAGE_TYPE = 2305;
// hex: 0x000902
var EVENT_DISTRIBUTED_OBJECT_MESSAGE_TYPE = 2306;
var REQUEST_LOCAL_ONLY_OFFSET = ClientMessage_1.PARTITION_ID_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var REQUEST_INITIAL_FRAME_SIZE = REQUEST_LOCAL_ONLY_OFFSET + BitsUtil_1.BitsUtil.BOOLEAN_SIZE_IN_BYTES;
var RESPONSE_RESPONSE_OFFSET = ClientMessage_1.RESPONSE_BACKUP_ACKS_OFFSET + BitsUtil_1.BitsUtil.BYTE_SIZE_IN_BYTES;
var EVENT_DISTRIBUTED_OBJECT_SOURCE_OFFSET = ClientMessage_1.PARTITION_ID_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var ClientAddDistributedObjectListenerCodec = /** @class */ (function () {
    function ClientAddDistributedObjectListenerCodec() {
    }
    ClientAddDistributedObjectListenerCodec.encodeRequest = function (localOnly) {
        var clientMessage = ClientMessage_1.ClientMessage.createForEncode();
        clientMessage.setRetryable(false);
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(REQUEST_INITIAL_FRAME_SIZE);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeBoolean(initialFrame.content, REQUEST_LOCAL_ONLY_OFFSET, localOnly);
        clientMessage.addFrame(initialFrame);
        clientMessage.setMessageType(REQUEST_MESSAGE_TYPE);
        clientMessage.setPartitionId(-1);
        return clientMessage;
    };
    ClientAddDistributedObjectListenerCodec.decodeResponse = function (clientMessage) {
        var initialFrame = clientMessage.nextFrame();
        return {
            response: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeUUID(initialFrame.content, RESPONSE_RESPONSE_OFFSET),
        };
    };
    ClientAddDistributedObjectListenerCodec.handle = function (clientMessage, handleDistributedObjectEvent) {
        if (handleDistributedObjectEvent === void 0) { handleDistributedObjectEvent = null; }
        var messageType = clientMessage.getMessageType();
        if (messageType === EVENT_DISTRIBUTED_OBJECT_MESSAGE_TYPE && handleDistributedObjectEvent !== null) {
            var initialFrame = clientMessage.nextFrame();
            var source = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeUUID(initialFrame.content, EVENT_DISTRIBUTED_OBJECT_SOURCE_OFFSET);
            var name = StringCodec_1.StringCodec.decode(clientMessage);
            var serviceName = StringCodec_1.StringCodec.decode(clientMessage);
            var eventType = StringCodec_1.StringCodec.decode(clientMessage);
            handleDistributedObjectEvent(name, serviceName, eventType, source);
            return;
        }
    };
    return ClientAddDistributedObjectListenerCodec;
}());
exports.ClientAddDistributedObjectListenerCodec = ClientAddDistributedObjectListenerCodec;
//# sourceMappingURL=ClientAddDistributedObjectListenerCodec.js.map