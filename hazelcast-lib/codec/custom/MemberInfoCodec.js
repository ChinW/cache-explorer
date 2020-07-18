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
var FixSizedTypesCodec_1 = require("../builtin/FixSizedTypesCodec");
var BitsUtil_1 = require("../../BitsUtil");
var ClientMessage_1 = require("../../ClientMessage");
var CodecUtil_1 = require("../builtin/CodecUtil");
var AddressCodec_1 = require("./AddressCodec");
var MapCodec_1 = require("../builtin/MapCodec");
var StringCodec_1 = require("../builtin/StringCodec");
var MemberVersionCodec_1 = require("./MemberVersionCodec");
var MemberInfo_1 = require("../../core/MemberInfo");
var UUID_OFFSET = 0;
var LITE_MEMBER_OFFSET = UUID_OFFSET + BitsUtil_1.BitsUtil.UUID_SIZE_IN_BYTES;
var INITIAL_FRAME_SIZE = LITE_MEMBER_OFFSET + BitsUtil_1.BitsUtil.BOOLEAN_SIZE_IN_BYTES;
var MemberInfoCodec = /** @class */ (function () {
    function MemberInfoCodec() {
    }
    MemberInfoCodec.encode = function (clientMessage, memberInfo) {
        clientMessage.addFrame(ClientMessage_1.BEGIN_FRAME.copy());
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(INITIAL_FRAME_SIZE, ClientMessage_1.DEFAULT_FLAGS);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeUUID(initialFrame.content, UUID_OFFSET, memberInfo.uuid);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeBoolean(initialFrame.content, LITE_MEMBER_OFFSET, memberInfo.liteMember);
        clientMessage.addFrame(initialFrame);
        AddressCodec_1.AddressCodec.encode(clientMessage, memberInfo.address);
        MapCodec_1.MapCodec.encode(clientMessage, memberInfo.attributes, StringCodec_1.StringCodec.encode, StringCodec_1.StringCodec.encode);
        MemberVersionCodec_1.MemberVersionCodec.encode(clientMessage, memberInfo.version);
        clientMessage.addFrame(ClientMessage_1.END_FRAME.copy());
    };
    MemberInfoCodec.decode = function (clientMessage) {
        // begin frame
        clientMessage.nextFrame();
        var initialFrame = clientMessage.nextFrame();
        var uuid = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeUUID(initialFrame.content, UUID_OFFSET);
        var liteMember = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeBoolean(initialFrame.content, LITE_MEMBER_OFFSET);
        var address = AddressCodec_1.AddressCodec.decode(clientMessage);
        var attributes = MapCodec_1.MapCodec.decode(clientMessage, StringCodec_1.StringCodec.decode, StringCodec_1.StringCodec.decode);
        var version = MemberVersionCodec_1.MemberVersionCodec.decode(clientMessage);
        CodecUtil_1.CodecUtil.fastForwardToEndFrame(clientMessage);
        return new MemberInfo_1.MemberInfo(address, uuid, attributes, liteMember, version);
    };
    return MemberInfoCodec;
}());
exports.MemberInfoCodec = MemberInfoCodec;
//# sourceMappingURL=MemberInfoCodec.js.map