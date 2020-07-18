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
// hex: 0x0D0A00
var REQUEST_MESSAGE_TYPE = 854528;
// hex: 0x0D0A01
var RESPONSE_MESSAGE_TYPE = 854529;
// hex: 0x0D0A02
var EVENT_ENTRY_MESSAGE_TYPE = 854530;
var REQUEST_LOCAL_ONLY_OFFSET = ClientMessage_1.PARTITION_ID_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var REQUEST_INITIAL_FRAME_SIZE = REQUEST_LOCAL_ONLY_OFFSET + BitsUtil_1.BitsUtil.BOOLEAN_SIZE_IN_BYTES;
var RESPONSE_RESPONSE_OFFSET = ClientMessage_1.RESPONSE_BACKUP_ACKS_OFFSET + BitsUtil_1.BitsUtil.BYTE_SIZE_IN_BYTES;
var EVENT_ENTRY_EVENT_TYPE_OFFSET = ClientMessage_1.PARTITION_ID_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var EVENT_ENTRY_UUID_OFFSET = EVENT_ENTRY_EVENT_TYPE_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var EVENT_ENTRY_NUMBER_OF_AFFECTED_ENTRIES_OFFSET = EVENT_ENTRY_UUID_OFFSET + BitsUtil_1.BitsUtil.UUID_SIZE_IN_BYTES;
var ReplicatedMapAddEntryListenerToKeyWithPredicateCodec = /** @class */ (function () {
    function ReplicatedMapAddEntryListenerToKeyWithPredicateCodec() {
    }
    ReplicatedMapAddEntryListenerToKeyWithPredicateCodec.encodeRequest = function (name, key, predicate, localOnly) {
        var clientMessage = ClientMessage_1.ClientMessage.createForEncode();
        clientMessage.setRetryable(false);
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(REQUEST_INITIAL_FRAME_SIZE);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeBoolean(initialFrame.content, REQUEST_LOCAL_ONLY_OFFSET, localOnly);
        clientMessage.addFrame(initialFrame);
        clientMessage.setMessageType(REQUEST_MESSAGE_TYPE);
        clientMessage.setPartitionId(-1);
        StringCodec_1.StringCodec.encode(clientMessage, name);
        DataCodec_1.DataCodec.encode(clientMessage, key);
        DataCodec_1.DataCodec.encode(clientMessage, predicate);
        return clientMessage;
    };
    ReplicatedMapAddEntryListenerToKeyWithPredicateCodec.decodeResponse = function (clientMessage) {
        var initialFrame = clientMessage.nextFrame();
        return {
            response: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeUUID(initialFrame.content, RESPONSE_RESPONSE_OFFSET),
        };
    };
    ReplicatedMapAddEntryListenerToKeyWithPredicateCodec.handle = function (clientMessage, handleEntryEvent) {
        if (handleEntryEvent === void 0) { handleEntryEvent = null; }
        var messageType = clientMessage.getMessageType();
        if (messageType === EVENT_ENTRY_MESSAGE_TYPE && handleEntryEvent !== null) {
            var initialFrame = clientMessage.nextFrame();
            var eventType = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeInt(initialFrame.content, EVENT_ENTRY_EVENT_TYPE_OFFSET);
            var uuid = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeUUID(initialFrame.content, EVENT_ENTRY_UUID_OFFSET);
            var numberOfAffectedEntries = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeInt(initialFrame.content, EVENT_ENTRY_NUMBER_OF_AFFECTED_ENTRIES_OFFSET);
            var key = CodecUtil_1.CodecUtil.decodeNullable(clientMessage, DataCodec_1.DataCodec.decode);
            var value = CodecUtil_1.CodecUtil.decodeNullable(clientMessage, DataCodec_1.DataCodec.decode);
            var oldValue = CodecUtil_1.CodecUtil.decodeNullable(clientMessage, DataCodec_1.DataCodec.decode);
            var mergingValue = CodecUtil_1.CodecUtil.decodeNullable(clientMessage, DataCodec_1.DataCodec.decode);
            handleEntryEvent(key, value, oldValue, mergingValue, eventType, uuid, numberOfAffectedEntries);
            return;
        }
    };
    return ReplicatedMapAddEntryListenerToKeyWithPredicateCodec;
}());
exports.ReplicatedMapAddEntryListenerToKeyWithPredicateCodec = ReplicatedMapAddEntryListenerToKeyWithPredicateCodec;
//# sourceMappingURL=ReplicatedMapAddEntryListenerToKeyWithPredicateCodec.js.map