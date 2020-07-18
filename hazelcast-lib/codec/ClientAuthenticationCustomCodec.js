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
var CodecUtil_1 = require("./builtin/CodecUtil");
var StringCodec_1 = require("./builtin/StringCodec");
var ByteArrayCodec_1 = require("./builtin/ByteArrayCodec");
var ListMultiFrameCodec_1 = require("./builtin/ListMultiFrameCodec");
var AddressCodec_1 = require("./custom/AddressCodec");
// hex: 0x000200
var REQUEST_MESSAGE_TYPE = 512;
// hex: 0x000201
var RESPONSE_MESSAGE_TYPE = 513;
var REQUEST_UUID_OFFSET = ClientMessage_1.PARTITION_ID_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var REQUEST_SERIALIZATION_VERSION_OFFSET = REQUEST_UUID_OFFSET + BitsUtil_1.BitsUtil.UUID_SIZE_IN_BYTES;
var REQUEST_INITIAL_FRAME_SIZE = REQUEST_SERIALIZATION_VERSION_OFFSET + BitsUtil_1.BitsUtil.BYTE_SIZE_IN_BYTES;
var RESPONSE_STATUS_OFFSET = ClientMessage_1.RESPONSE_BACKUP_ACKS_OFFSET + BitsUtil_1.BitsUtil.BYTE_SIZE_IN_BYTES;
var RESPONSE_MEMBER_UUID_OFFSET = RESPONSE_STATUS_OFFSET + BitsUtil_1.BitsUtil.BYTE_SIZE_IN_BYTES;
var RESPONSE_SERIALIZATION_VERSION_OFFSET = RESPONSE_MEMBER_UUID_OFFSET + BitsUtil_1.BitsUtil.UUID_SIZE_IN_BYTES;
var RESPONSE_PARTITION_COUNT_OFFSET = RESPONSE_SERIALIZATION_VERSION_OFFSET + BitsUtil_1.BitsUtil.BYTE_SIZE_IN_BYTES;
var RESPONSE_CLUSTER_ID_OFFSET = RESPONSE_PARTITION_COUNT_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var RESPONSE_FAILOVER_SUPPORTED_OFFSET = RESPONSE_CLUSTER_ID_OFFSET + BitsUtil_1.BitsUtil.UUID_SIZE_IN_BYTES;
var ClientAuthenticationCustomCodec = /** @class */ (function () {
    function ClientAuthenticationCustomCodec() {
    }
    ClientAuthenticationCustomCodec.encodeRequest = function (clusterName, credentials, uuid, clientType, serializationVersion, clientHazelcastVersion, clientName, labels) {
        var clientMessage = ClientMessage_1.ClientMessage.createForEncode();
        clientMessage.setRetryable(true);
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(REQUEST_INITIAL_FRAME_SIZE);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeUUID(initialFrame.content, REQUEST_UUID_OFFSET, uuid);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeByte(initialFrame.content, REQUEST_SERIALIZATION_VERSION_OFFSET, serializationVersion);
        clientMessage.addFrame(initialFrame);
        clientMessage.setMessageType(REQUEST_MESSAGE_TYPE);
        clientMessage.setPartitionId(-1);
        StringCodec_1.StringCodec.encode(clientMessage, clusterName);
        ByteArrayCodec_1.ByteArrayCodec.encode(clientMessage, credentials);
        StringCodec_1.StringCodec.encode(clientMessage, clientType);
        StringCodec_1.StringCodec.encode(clientMessage, clientHazelcastVersion);
        StringCodec_1.StringCodec.encode(clientMessage, clientName);
        ListMultiFrameCodec_1.ListMultiFrameCodec.encode(clientMessage, labels, StringCodec_1.StringCodec.encode);
        return clientMessage;
    };
    ClientAuthenticationCustomCodec.decodeResponse = function (clientMessage) {
        var initialFrame = clientMessage.nextFrame();
        return {
            status: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeByte(initialFrame.content, RESPONSE_STATUS_OFFSET),
            memberUuid: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeUUID(initialFrame.content, RESPONSE_MEMBER_UUID_OFFSET),
            serializationVersion: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeByte(initialFrame.content, RESPONSE_SERIALIZATION_VERSION_OFFSET),
            partitionCount: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeInt(initialFrame.content, RESPONSE_PARTITION_COUNT_OFFSET),
            clusterId: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeUUID(initialFrame.content, RESPONSE_CLUSTER_ID_OFFSET),
            failoverSupported: FixSizedTypesCodec_1.FixSizedTypesCodec.decodeBoolean(initialFrame.content, RESPONSE_FAILOVER_SUPPORTED_OFFSET),
            address: CodecUtil_1.CodecUtil.decodeNullable(clientMessage, AddressCodec_1.AddressCodec.decode),
            serverHazelcastVersion: StringCodec_1.StringCodec.decode(clientMessage),
        };
    };
    return ClientAuthenticationCustomCodec;
}());
exports.ClientAuthenticationCustomCodec = ClientAuthenticationCustomCodec;
//# sourceMappingURL=ClientAuthenticationCustomCodec.js.map