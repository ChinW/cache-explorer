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
var StringCodec_1 = require("../builtin/StringCodec");
var ListMultiFrameCodec_1 = require("../builtin/ListMultiFrameCodec");
var StackTraceElementCodec_1 = require("./StackTraceElementCodec");
var ErrorHolder_1 = require("../../protocol/ErrorHolder");
var ERROR_CODE_OFFSET = 0;
var INITIAL_FRAME_SIZE = ERROR_CODE_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var ErrorHolderCodec = /** @class */ (function () {
    function ErrorHolderCodec() {
    }
    ErrorHolderCodec.encode = function (clientMessage, errorHolder) {
        clientMessage.addFrame(ClientMessage_1.BEGIN_FRAME.copy());
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(INITIAL_FRAME_SIZE, ClientMessage_1.DEFAULT_FLAGS);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeInt(initialFrame.content, ERROR_CODE_OFFSET, errorHolder.errorCode);
        clientMessage.addFrame(initialFrame);
        StringCodec_1.StringCodec.encode(clientMessage, errorHolder.className);
        CodecUtil_1.CodecUtil.encodeNullable(clientMessage, errorHolder.message, StringCodec_1.StringCodec.encode);
        ListMultiFrameCodec_1.ListMultiFrameCodec.encode(clientMessage, errorHolder.stackTraceElements, StackTraceElementCodec_1.StackTraceElementCodec.encode);
        clientMessage.addFrame(ClientMessage_1.END_FRAME.copy());
    };
    ErrorHolderCodec.decode = function (clientMessage) {
        // begin frame
        clientMessage.nextFrame();
        var initialFrame = clientMessage.nextFrame();
        var errorCode = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeInt(initialFrame.content, ERROR_CODE_OFFSET);
        var className = StringCodec_1.StringCodec.decode(clientMessage);
        var message = CodecUtil_1.CodecUtil.decodeNullable(clientMessage, StringCodec_1.StringCodec.decode);
        var stackTraceElements = ListMultiFrameCodec_1.ListMultiFrameCodec.decode(clientMessage, StackTraceElementCodec_1.StackTraceElementCodec.decode);
        CodecUtil_1.CodecUtil.fastForwardToEndFrame(clientMessage);
        return new ErrorHolder_1.ErrorHolder(errorCode, className, message, stackTraceElements);
    };
    return ErrorHolderCodec;
}());
exports.ErrorHolderCodec = ErrorHolderCodec;
//# sourceMappingURL=ErrorHolderCodec.js.map