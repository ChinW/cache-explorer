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
var ListMultiFrameCodec_1 = require("./builtin/ListMultiFrameCodec");
var MemberInfoCodec_1 = require("./custom/MemberInfoCodec");
var EntryListUUIDListIntegerCodec_1 = require("./builtin/EntryListUUIDListIntegerCodec");
// hex: 0x000300
var REQUEST_MESSAGE_TYPE = 768;
// hex: 0x000301
var RESPONSE_MESSAGE_TYPE = 769;
// hex: 0x000302
var EVENT_MEMBERS_VIEW_MESSAGE_TYPE = 770;
// hex: 0x000303
var EVENT_PARTITIONS_VIEW_MESSAGE_TYPE = 771;
var REQUEST_INITIAL_FRAME_SIZE = ClientMessage_1.PARTITION_ID_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var EVENT_MEMBERS_VIEW_VERSION_OFFSET = ClientMessage_1.PARTITION_ID_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var EVENT_PARTITIONS_VIEW_VERSION_OFFSET = ClientMessage_1.PARTITION_ID_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var ClientAddClusterViewListenerCodec = /** @class */ (function () {
    function ClientAddClusterViewListenerCodec() {
    }
    ClientAddClusterViewListenerCodec.encodeRequest = function () {
        var clientMessage = ClientMessage_1.ClientMessage.createForEncode();
        clientMessage.setRetryable(false);
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(REQUEST_INITIAL_FRAME_SIZE);
        clientMessage.addFrame(initialFrame);
        clientMessage.setMessageType(REQUEST_MESSAGE_TYPE);
        clientMessage.setPartitionId(-1);
        return clientMessage;
    };
    ClientAddClusterViewListenerCodec.handle = function (clientMessage, handleMembersViewEvent, handlePartitionsViewEvent) {
        if (handleMembersViewEvent === void 0) { handleMembersViewEvent = null; }
        if (handlePartitionsViewEvent === void 0) { handlePartitionsViewEvent = null; }
        var messageType = clientMessage.getMessageType();
        if (messageType === EVENT_MEMBERS_VIEW_MESSAGE_TYPE && handleMembersViewEvent !== null) {
            var initialFrame = clientMessage.nextFrame();
            var version = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeInt(initialFrame.content, EVENT_MEMBERS_VIEW_VERSION_OFFSET);
            var memberInfos = ListMultiFrameCodec_1.ListMultiFrameCodec.decode(clientMessage, MemberInfoCodec_1.MemberInfoCodec.decode);
            handleMembersViewEvent(version, memberInfos);
            return;
        }
        if (messageType === EVENT_PARTITIONS_VIEW_MESSAGE_TYPE && handlePartitionsViewEvent !== null) {
            var initialFrame = clientMessage.nextFrame();
            var version = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeInt(initialFrame.content, EVENT_PARTITIONS_VIEW_VERSION_OFFSET);
            var partitions = EntryListUUIDListIntegerCodec_1.EntryListUUIDListIntegerCodec.decode(clientMessage);
            handlePartitionsViewEvent(version, partitions);
            return;
        }
    };
    return ClientAddClusterViewListenerCodec;
}());
exports.ClientAddClusterViewListenerCodec = ClientAddClusterViewListenerCodec;
//# sourceMappingURL=ClientAddClusterViewListenerCodec.js.map