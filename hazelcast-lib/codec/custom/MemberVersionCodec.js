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
var MemberVersion_1 = require("../../core/MemberVersion");
var MAJOR_OFFSET = 0;
var MINOR_OFFSET = MAJOR_OFFSET + BitsUtil_1.BitsUtil.BYTE_SIZE_IN_BYTES;
var PATCH_OFFSET = MINOR_OFFSET + BitsUtil_1.BitsUtil.BYTE_SIZE_IN_BYTES;
var INITIAL_FRAME_SIZE = PATCH_OFFSET + BitsUtil_1.BitsUtil.BYTE_SIZE_IN_BYTES;
var MemberVersionCodec = /** @class */ (function () {
    function MemberVersionCodec() {
    }
    MemberVersionCodec.encode = function (clientMessage, memberVersion) {
        clientMessage.addFrame(ClientMessage_1.BEGIN_FRAME.copy());
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(INITIAL_FRAME_SIZE, ClientMessage_1.DEFAULT_FLAGS);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeByte(initialFrame.content, MAJOR_OFFSET, memberVersion.major);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeByte(initialFrame.content, MINOR_OFFSET, memberVersion.minor);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeByte(initialFrame.content, PATCH_OFFSET, memberVersion.patch);
        clientMessage.addFrame(initialFrame);
        clientMessage.addFrame(ClientMessage_1.END_FRAME.copy());
    };
    MemberVersionCodec.decode = function (clientMessage) {
        // begin frame
        clientMessage.nextFrame();
        var initialFrame = clientMessage.nextFrame();
        var major = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeByte(initialFrame.content, MAJOR_OFFSET);
        var minor = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeByte(initialFrame.content, MINOR_OFFSET);
        var patch = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeByte(initialFrame.content, PATCH_OFFSET);
        CodecUtil_1.CodecUtil.fastForwardToEndFrame(clientMessage);
        return new MemberVersion_1.MemberVersion(major, minor, patch);
    };
    return MemberVersionCodec;
}());
exports.MemberVersionCodec = MemberVersionCodec;
//# sourceMappingURL=MemberVersionCodec.js.map