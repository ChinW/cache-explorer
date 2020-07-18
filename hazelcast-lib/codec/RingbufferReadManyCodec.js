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
var CodecUtil_1 = require("./builtin/CodecUtil");
var ListMultiFrameCodec_1 = require("./builtin/ListMultiFrameCodec");
var LongArrayCodec_1 = require("./builtin/LongArrayCodec");
// hex: 0x170900
var REQUEST_MESSAGE_TYPE = 1509632;
// hex: 0x170901
var RESPONSE_MESSAGE_TYPE = 1509633;
var REQUEST_START_SEQUENCE_OFFSET = ClientMessage_1.PARTITION_ID_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var REQUEST_MIN_COUNT_OFFSET = REQUEST_START_SEQUENCE_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var REQUEST_MAX_COUNT_OFFSET = REQUEST_MIN_COUNT_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var REQUEST_INITIAL_FRAME_SIZE = REQUEST_MAX_COUNT_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var RESPONSE_READ_COUNT_OFFSET = ClientMessage_1.RESPONSE_BACKUP_ACKS_OFFSET + BitsUtil_1.BitsUtil.BYTE_SIZE_IN_BYTES;
var RESPONSE_NEXT_SEQ_OFFSET = RESPONSE_READ_COUNT_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var RingbufferReadManyCodec = /** @class */ (function () {
    function RingbufferReadManyCodec() {
    }
    RingbufferReadManyCodec.encodeRequest = function (name, startSequence, minCount, maxCount, filter) {
        var clientMessage = ClientMessage_1.ClientMessage.createForEncode();
        clientMessage.setRetryable(true);
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(REQUEST_INITIAL_FRAME_SIZE);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(initialFrame.content, REQUEST_START_SEQUENCE_OFFSET, startSequence);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeInt(initialFrame.content, REQUEST_MIN_COUNT_OFFSET, minCount);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeInt(initialFrame.content, REQUEST_MAX_COUNT_OFFSET, maxCount);
        clientMessage.addFrame(initialFrame);
        clientMessage.setMessageType(REQUEST_MESSAGE_TYPE);
        clientMessage.setPartitionId(-1);
        StringCodec_1.StringCodec.encode(clientMessage, name);
        CodecUtil_1.CodecUtil.encodeNullable(clientMessage, filter, DataCodec_1.DataCodec.encode);
        return clientMessage;
    };
    RingbufferReadManyCodec.decodeResponse = function (clientMessage) {
        var initialFrame = clientMessage.nextFrame();
        return {
            readCount: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeInt(initialFrame.content, RESPONSE_READ_COUNT_OFFSET),
            nextSeq: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(initialFrame.content, RESPONSE_NEXT_SEQ_OFFSET),
            items: ListMultiFrameCodec_1.ListMultiFrameCodec.decode(clientMessage, DataCodec_1.DataCodec.decode),
            itemSeqs: CodecUtil_1.CodecUtil.decodeNullable(clientMessage, LongArrayCodec_1.LongArrayCodec.decode),
        };
    };
    return RingbufferReadManyCodec;
}());
exports.RingbufferReadManyCodec = RingbufferReadManyCodec;
//# sourceMappingURL=RingbufferReadManyCodec.js.map