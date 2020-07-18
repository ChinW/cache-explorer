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
var ListUUIDCodec_1 = require("./builtin/ListUUIDCodec");
var ListLongCodec_1 = require("./builtin/ListLongCodec");
// hex: 0x013F00
var REQUEST_MESSAGE_TYPE = 81664;
// hex: 0x013F01
var RESPONSE_MESSAGE_TYPE = 81665;
// hex: 0x013F02
var EVENT_I_MAP_INVALIDATION_MESSAGE_TYPE = 81666;
// hex: 0x013F03
var EVENT_I_MAP_BATCH_INVALIDATION_MESSAGE_TYPE = 81667;
var REQUEST_LISTENER_FLAGS_OFFSET = ClientMessage_1.PARTITION_ID_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var REQUEST_LOCAL_ONLY_OFFSET = REQUEST_LISTENER_FLAGS_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var REQUEST_INITIAL_FRAME_SIZE = REQUEST_LOCAL_ONLY_OFFSET + BitsUtil_1.BitsUtil.BOOLEAN_SIZE_IN_BYTES;
var RESPONSE_RESPONSE_OFFSET = ClientMessage_1.RESPONSE_BACKUP_ACKS_OFFSET + BitsUtil_1.BitsUtil.BYTE_SIZE_IN_BYTES;
var EVENT_I_MAP_INVALIDATION_SOURCE_UUID_OFFSET = ClientMessage_1.PARTITION_ID_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var EVENT_I_MAP_INVALIDATION_PARTITION_UUID_OFFSET = EVENT_I_MAP_INVALIDATION_SOURCE_UUID_OFFSET + BitsUtil_1.BitsUtil.UUID_SIZE_IN_BYTES;
var EVENT_I_MAP_INVALIDATION_SEQUENCE_OFFSET = EVENT_I_MAP_INVALIDATION_PARTITION_UUID_OFFSET + BitsUtil_1.BitsUtil.UUID_SIZE_IN_BYTES;
var MapAddNearCacheInvalidationListenerCodec = /** @class */ (function () {
    function MapAddNearCacheInvalidationListenerCodec() {
    }
    MapAddNearCacheInvalidationListenerCodec.encodeRequest = function (name, listenerFlags, localOnly) {
        var clientMessage = ClientMessage_1.ClientMessage.createForEncode();
        clientMessage.setRetryable(false);
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(REQUEST_INITIAL_FRAME_SIZE);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeInt(initialFrame.content, REQUEST_LISTENER_FLAGS_OFFSET, listenerFlags);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeBoolean(initialFrame.content, REQUEST_LOCAL_ONLY_OFFSET, localOnly);
        clientMessage.addFrame(initialFrame);
        clientMessage.setMessageType(REQUEST_MESSAGE_TYPE);
        clientMessage.setPartitionId(-1);
        StringCodec_1.StringCodec.encode(clientMessage, name);
        return clientMessage;
    };
    MapAddNearCacheInvalidationListenerCodec.decodeResponse = function (clientMessage) {
        var initialFrame = clientMessage.nextFrame();
        return {
            response: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeUUID(initialFrame.content, RESPONSE_RESPONSE_OFFSET),
        };
    };
    MapAddNearCacheInvalidationListenerCodec.handle = function (clientMessage, handleIMapInvalidationEvent, handleIMapBatchInvalidationEvent) {
        if (handleIMapInvalidationEvent === void 0) { handleIMapInvalidationEvent = null; }
        if (handleIMapBatchInvalidationEvent === void 0) { handleIMapBatchInvalidationEvent = null; }
        var messageType = clientMessage.getMessageType();
        if (messageType === EVENT_I_MAP_INVALIDATION_MESSAGE_TYPE && handleIMapInvalidationEvent !== null) {
            var initialFrame = clientMessage.nextFrame();
            var sourceUuid = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeUUID(initialFrame.content, EVENT_I_MAP_INVALIDATION_SOURCE_UUID_OFFSET);
            var partitionUuid = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeUUID(initialFrame.content, EVENT_I_MAP_INVALIDATION_PARTITION_UUID_OFFSET);
            var sequence = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(initialFrame.content, EVENT_I_MAP_INVALIDATION_SEQUENCE_OFFSET);
            var key = CodecUtil_1.CodecUtil.decodeNullable(clientMessage, DataCodec_1.DataCodec.decode);
            handleIMapInvalidationEvent(key, sourceUuid, partitionUuid, sequence);
            return;
        }
        if (messageType === EVENT_I_MAP_BATCH_INVALIDATION_MESSAGE_TYPE && handleIMapBatchInvalidationEvent !== null) {
            // empty initial frame
            clientMessage.nextFrame();
            var keys = ListMultiFrameCodec_1.ListMultiFrameCodec.decode(clientMessage, DataCodec_1.DataCodec.decode);
            var sourceUuids = ListUUIDCodec_1.ListUUIDCodec.decode(clientMessage);
            var partitionUuids = ListUUIDCodec_1.ListUUIDCodec.decode(clientMessage);
            var sequences = ListLongCodec_1.ListLongCodec.decode(clientMessage);
            handleIMapBatchInvalidationEvent(keys, sourceUuids, partitionUuids, sequences);
            return;
        }
    };
    return MapAddNearCacheInvalidationListenerCodec;
}());
exports.MapAddNearCacheInvalidationListenerCodec = MapAddNearCacheInvalidationListenerCodec;
//# sourceMappingURL=MapAddNearCacheInvalidationListenerCodec.js.map