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
var ClientMessage_1 = require("../../ClientMessage");
var CodecUtil_1 = require("./CodecUtil");
var ListMultiFrameCodec = /** @class */ (function () {
    function ListMultiFrameCodec() {
    }
    ListMultiFrameCodec.encode = function (clientMessage, list, encoder) {
        clientMessage.addFrame(ClientMessage_1.BEGIN_FRAME.copy());
        for (var i = 0, n = list.length; i < n; i++) {
            encoder(clientMessage, list[i]);
        }
        clientMessage.addFrame(ClientMessage_1.END_FRAME.copy());
    };
    ListMultiFrameCodec.encodeContainsNullable = function (clientMessage, list, encoder) {
        clientMessage.addFrame(ClientMessage_1.BEGIN_FRAME.copy());
        for (var i = 0, n = list.length; i < n; i++) {
            var item = list[i];
            if (item === null) {
                clientMessage.addFrame(ClientMessage_1.NULL_FRAME.copy());
            }
            else {
                encoder(clientMessage, list[i]);
            }
        }
        clientMessage.addFrame(ClientMessage_1.END_FRAME.copy());
    };
    ListMultiFrameCodec.encodeNullable = function (clientMessage, list, encoder) {
        if (list === null) {
            clientMessage.addFrame(ClientMessage_1.NULL_FRAME.copy());
        }
        else {
            this.encode(clientMessage, list, encoder);
        }
    };
    ListMultiFrameCodec.decode = function (clientMessage, decoder) {
        var result = [];
        // begin frame
        clientMessage.nextFrame();
        while (!CodecUtil_1.CodecUtil.nextFrameIsDataStructureEndFrame(clientMessage)) {
            result.push(decoder(clientMessage));
        }
        // end frame
        clientMessage.nextFrame();
        return result;
    };
    return ListMultiFrameCodec;
}());
exports.ListMultiFrameCodec = ListMultiFrameCodec;
//# sourceMappingURL=ListMultiFrameCodec.js.map