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
var BitmapIndexOptionsCodec_1 = require("./BitmapIndexOptionsCodec");
var IndexConfig_1 = require("../../config/IndexConfig");
var TYPE_OFFSET = 0;
var INITIAL_FRAME_SIZE = TYPE_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var IndexConfigCodec = /** @class */ (function () {
    function IndexConfigCodec() {
    }
    IndexConfigCodec.encode = function (clientMessage, indexConfig) {
        clientMessage.addFrame(ClientMessage_1.BEGIN_FRAME.copy());
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(INITIAL_FRAME_SIZE, ClientMessage_1.DEFAULT_FLAGS);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeInt(initialFrame.content, TYPE_OFFSET, indexConfig.type);
        clientMessage.addFrame(initialFrame);
        CodecUtil_1.CodecUtil.encodeNullable(clientMessage, indexConfig.name, StringCodec_1.StringCodec.encode);
        ListMultiFrameCodec_1.ListMultiFrameCodec.encode(clientMessage, indexConfig.attributes, StringCodec_1.StringCodec.encode);
        CodecUtil_1.CodecUtil.encodeNullable(clientMessage, indexConfig.bitmapIndexOptions, BitmapIndexOptionsCodec_1.BitmapIndexOptionsCodec.encode);
        clientMessage.addFrame(ClientMessage_1.END_FRAME.copy());
    };
    IndexConfigCodec.decode = function (clientMessage) {
        // begin frame
        clientMessage.nextFrame();
        var initialFrame = clientMessage.nextFrame();
        var type = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeInt(initialFrame.content, TYPE_OFFSET);
        var name = CodecUtil_1.CodecUtil.decodeNullable(clientMessage, StringCodec_1.StringCodec.decode);
        var attributes = ListMultiFrameCodec_1.ListMultiFrameCodec.decode(clientMessage, StringCodec_1.StringCodec.decode);
        var bitmapIndexOptions = CodecUtil_1.CodecUtil.decodeNullable(clientMessage, BitmapIndexOptionsCodec_1.BitmapIndexOptionsCodec.decode);
        CodecUtil_1.CodecUtil.fastForwardToEndFrame(clientMessage);
        return new IndexConfig_1.IndexConfig(name, type, attributes, bitmapIndexOptions);
    };
    return IndexConfigCodec;
}());
exports.IndexConfigCodec = IndexConfigCodec;
//# sourceMappingURL=IndexConfigCodec.js.map