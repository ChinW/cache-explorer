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
var SimpleEntryViewCodec_1 = require("./custom/SimpleEntryViewCodec");
var CodecUtil_1 = require("./builtin/CodecUtil");
// hex: 0x011D00
var REQUEST_MESSAGE_TYPE = 72960;
// hex: 0x011D01
var RESPONSE_MESSAGE_TYPE = 72961;
var REQUEST_THREAD_ID_OFFSET = ClientMessage_1.PARTITION_ID_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var REQUEST_INITIAL_FRAME_SIZE = REQUEST_THREAD_ID_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var RESPONSE_MAX_IDLE_OFFSET = ClientMessage_1.RESPONSE_BACKUP_ACKS_OFFSET + BitsUtil_1.BitsUtil.BYTE_SIZE_IN_BYTES;
var MapGetEntryViewCodec = /** @class */ (function () {
    function MapGetEntryViewCodec() {
    }
    MapGetEntryViewCodec.encodeRequest = function (name, key, threadId) {
        var clientMessage = ClientMessage_1.ClientMessage.createForEncode();
        clientMessage.setRetryable(true);
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(REQUEST_INITIAL_FRAME_SIZE);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(initialFrame.content, REQUEST_THREAD_ID_OFFSET, threadId);
        clientMessage.addFrame(initialFrame);
        clientMessage.setMessageType(REQUEST_MESSAGE_TYPE);
        clientMessage.setPartitionId(-1);
        StringCodec_1.StringCodec.encode(clientMessage, name);
        DataCodec_1.DataCodec.encode(clientMessage, key);
        return clientMessage;
    };
    MapGetEntryViewCodec.decodeResponse = function (clientMessage) {
        var initialFrame = clientMessage.nextFrame();
        return {
            maxIdle: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(initialFrame.content, RESPONSE_MAX_IDLE_OFFSET),
            response: CodecUtil_1.CodecUtil.decodeNullable(clientMessage, SimpleEntryViewCodec_1.SimpleEntryViewCodec.decode),
        };
    };
    return MapGetEntryViewCodec;
}());
exports.MapGetEntryViewCodec = MapGetEntryViewCodec;
//# sourceMappingURL=MapGetEntryViewCodec.js.map