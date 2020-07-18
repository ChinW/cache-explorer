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
var DataCodec_1 = require("./builtin/DataCodec");
// hex: 0x010C00
var REQUEST_MESSAGE_TYPE = 68608;
// hex: 0x010C01
var RESPONSE_MESSAGE_TYPE = 68609;
var REQUEST_THREAD_ID_OFFSET = ClientMessage_1.PARTITION_ID_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var REQUEST_TIMEOUT_OFFSET = REQUEST_THREAD_ID_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var REQUEST_INITIAL_FRAME_SIZE = REQUEST_TIMEOUT_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var RESPONSE_RESPONSE_OFFSET = ClientMessage_1.RESPONSE_BACKUP_ACKS_OFFSET + BitsUtil_1.BitsUtil.BYTE_SIZE_IN_BYTES;
var MapTryPutCodec = /** @class */ (function () {
    function MapTryPutCodec() {
    }
    MapTryPutCodec.encodeRequest = function (name, key, value, threadId, timeout) {
        var clientMessage = ClientMessage_1.ClientMessage.createForEncode();
        clientMessage.setRetryable(false);
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(REQUEST_INITIAL_FRAME_SIZE);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(initialFrame.content, REQUEST_THREAD_ID_OFFSET, threadId);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(initialFrame.content, REQUEST_TIMEOUT_OFFSET, timeout);
        clientMessage.addFrame(initialFrame);
        clientMessage.setMessageType(REQUEST_MESSAGE_TYPE);
        clientMessage.setPartitionId(-1);
        StringCodec_1.StringCodec.encode(clientMessage, name);
        DataCodec_1.DataCodec.encode(clientMessage, key);
        DataCodec_1.DataCodec.encode(clientMessage, value);
        return clientMessage;
    };
    MapTryPutCodec.decodeResponse = function (clientMessage) {
        var initialFrame = clientMessage.nextFrame();
        return {
            response: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeBoolean(initialFrame.content, RESPONSE_RESPONSE_OFFSET),
        };
    };
    return MapTryPutCodec;
}());
exports.MapTryPutCodec = MapTryPutCodec;
//# sourceMappingURL=MapTryPutCodec.js.map