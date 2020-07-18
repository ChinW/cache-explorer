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
// hex: 0x1C0100
var REQUEST_MESSAGE_TYPE = 1835264;
// hex: 0x1C0101
var RESPONSE_MESSAGE_TYPE = 1835265;
var REQUEST_BATCH_SIZE_OFFSET = ClientMessage_1.PARTITION_ID_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var REQUEST_INITIAL_FRAME_SIZE = REQUEST_BATCH_SIZE_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var RESPONSE_BASE_OFFSET = ClientMessage_1.RESPONSE_BACKUP_ACKS_OFFSET + BitsUtil_1.BitsUtil.BYTE_SIZE_IN_BYTES;
var RESPONSE_INCREMENT_OFFSET = RESPONSE_BASE_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var RESPONSE_BATCH_SIZE_OFFSET = RESPONSE_INCREMENT_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var FlakeIdGeneratorNewIdBatchCodec = /** @class */ (function () {
    function FlakeIdGeneratorNewIdBatchCodec() {
    }
    FlakeIdGeneratorNewIdBatchCodec.encodeRequest = function (name, batchSize) {
        var clientMessage = ClientMessage_1.ClientMessage.createForEncode();
        clientMessage.setRetryable(true);
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(REQUEST_INITIAL_FRAME_SIZE);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeInt(initialFrame.content, REQUEST_BATCH_SIZE_OFFSET, batchSize);
        clientMessage.addFrame(initialFrame);
        clientMessage.setMessageType(REQUEST_MESSAGE_TYPE);
        clientMessage.setPartitionId(-1);
        StringCodec_1.StringCodec.encode(clientMessage, name);
        return clientMessage;
    };
    FlakeIdGeneratorNewIdBatchCodec.decodeResponse = function (clientMessage) {
        var initialFrame = clientMessage.nextFrame();
        return {
            base: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(initialFrame.content, RESPONSE_BASE_OFFSET),
            increment: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(initialFrame.content, RESPONSE_INCREMENT_OFFSET),
            batchSize: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeInt(initialFrame.content, RESPONSE_BATCH_SIZE_OFFSET),
        };
    };
    return FlakeIdGeneratorNewIdBatchCodec;
}());
exports.FlakeIdGeneratorNewIdBatchCodec = FlakeIdGeneratorNewIdBatchCodec;
//# sourceMappingURL=FlakeIdGeneratorNewIdBatchCodec.js.map