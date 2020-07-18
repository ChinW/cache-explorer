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
var StackTraceElement_1 = require("../../protocol/StackTraceElement");
var LINE_NUMBER_OFFSET = 0;
var INITIAL_FRAME_SIZE = LINE_NUMBER_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var StackTraceElementCodec = /** @class */ (function () {
    function StackTraceElementCodec() {
    }
    StackTraceElementCodec.encode = function (clientMessage, stackTraceElement) {
        clientMessage.addFrame(ClientMessage_1.BEGIN_FRAME.copy());
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(INITIAL_FRAME_SIZE, ClientMessage_1.DEFAULT_FLAGS);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeInt(initialFrame.content, LINE_NUMBER_OFFSET, stackTraceElement.lineNumber);
        clientMessage.addFrame(initialFrame);
        StringCodec_1.StringCodec.encode(clientMessage, stackTraceElement.className);
        StringCodec_1.StringCodec.encode(clientMessage, stackTraceElement.methodName);
        CodecUtil_1.CodecUtil.encodeNullable(clientMessage, stackTraceElement.fileName, StringCodec_1.StringCodec.encode);
        clientMessage.addFrame(ClientMessage_1.END_FRAME.copy());
    };
    StackTraceElementCodec.decode = function (clientMessage) {
        // begin frame
        clientMessage.nextFrame();
        var initialFrame = clientMessage.nextFrame();
        var lineNumber = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeInt(initialFrame.content, LINE_NUMBER_OFFSET);
        var className = StringCodec_1.StringCodec.decode(clientMessage);
        var methodName = StringCodec_1.StringCodec.decode(clientMessage);
        var fileName = CodecUtil_1.CodecUtil.decodeNullable(clientMessage, StringCodec_1.StringCodec.decode);
        CodecUtil_1.CodecUtil.fastForwardToEndFrame(clientMessage);
        return new StackTraceElement_1.StackTraceElement(className, methodName, fileName, lineNumber);
    };
    return StackTraceElementCodec;
}());
exports.StackTraceElementCodec = StackTraceElementCodec;
//# sourceMappingURL=StackTraceElementCodec.js.map