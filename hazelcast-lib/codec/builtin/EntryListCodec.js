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
var EntryListCodec = /** @class */ (function () {
    function EntryListCodec() {
    }
    EntryListCodec.encode = function (clientMessage, entries, keyEncoder, valueEncoder) {
        clientMessage.addFrame(ClientMessage_1.BEGIN_FRAME.copy());
        for (var i = 0, n = entries.length; i < n; i++) {
            keyEncoder(clientMessage, entries[i][0]);
            valueEncoder(clientMessage, entries[i][1]);
        }
        clientMessage.addFrame(ClientMessage_1.END_FRAME.copy());
    };
    EntryListCodec.encodeNullable = function (clientMessage, entries, keyEncoder, valueEncoder) {
        if (entries === null) {
            clientMessage.addFrame(ClientMessage_1.NULL_FRAME.copy());
        }
        else {
            this.encode(clientMessage, entries, keyEncoder, valueEncoder);
        }
    };
    EntryListCodec.decode = function (clientMessage, keyDecoder, valueDecoder) {
        var result = [];
        // begin frame
        clientMessage.nextFrame();
        while (!CodecUtil_1.CodecUtil.nextFrameIsDataStructureEndFrame(clientMessage)) {
            var key = keyDecoder(clientMessage);
            var value = valueDecoder(clientMessage);
            result.push([key, value]);
        }
        // end frame
        clientMessage.nextFrame();
        return result;
    };
    EntryListCodec.decodeNullable = function (clientMessage, keyDecoder, valueDecoder) {
        return CodecUtil_1.CodecUtil.nextFrameIsNullFrame(clientMessage) ? null : this.decode(clientMessage, keyDecoder, valueDecoder);
    };
    return EntryListCodec;
}());
exports.EntryListCodec = EntryListCodec;
//# sourceMappingURL=EntryListCodec.js.map