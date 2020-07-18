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
var ClientMessage_1 = require("../ClientMessage");
var StringCodec_1 = require("./builtin/StringCodec");
var EntryListCodec_1 = require("./builtin/EntryListCodec");
var DataCodec_1 = require("./builtin/DataCodec");
// hex: 0x0D0800
var REQUEST_MESSAGE_TYPE = 854016;
// hex: 0x0D0801
var RESPONSE_MESSAGE_TYPE = 854017;
var REQUEST_INITIAL_FRAME_SIZE = ClientMessage_1.PARTITION_ID_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var ReplicatedMapPutAllCodec = /** @class */ (function () {
    function ReplicatedMapPutAllCodec() {
    }
    ReplicatedMapPutAllCodec.encodeRequest = function (name, entries) {
        var clientMessage = ClientMessage_1.ClientMessage.createForEncode();
        clientMessage.setRetryable(false);
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(REQUEST_INITIAL_FRAME_SIZE);
        clientMessage.addFrame(initialFrame);
        clientMessage.setMessageType(REQUEST_MESSAGE_TYPE);
        clientMessage.setPartitionId(-1);
        StringCodec_1.StringCodec.encode(clientMessage, name);
        EntryListCodec_1.EntryListCodec.encode(clientMessage, entries, DataCodec_1.DataCodec.encode, DataCodec_1.DataCodec.encode);
        return clientMessage;
    };
    return ReplicatedMapPutAllCodec;
}());
exports.ReplicatedMapPutAllCodec = ReplicatedMapPutAllCodec;
//# sourceMappingURL=ReplicatedMapPutAllCodec.js.map