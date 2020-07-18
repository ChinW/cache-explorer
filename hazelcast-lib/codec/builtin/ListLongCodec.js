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
var BitsUtil_1 = require("../../BitsUtil");
var FixSizedTypesCodec_1 = require("./FixSizedTypesCodec");
var ListLongCodec = /** @class */ (function () {
    function ListLongCodec() {
    }
    ListLongCodec.encode = function (clientMessage, list) {
        var itemCount = list.length;
        var frame = new ClientMessage_1.Frame(Buffer.allocUnsafe(itemCount * BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES));
        for (var i = 0; i < itemCount; i++) {
            FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(frame.content, i * BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES, list[i]);
        }
        clientMessage.addFrame(frame);
    };
    ListLongCodec.decode = function (clientMessage) {
        var frame = clientMessage.nextFrame();
        var itemCount = frame.content.length / BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
        var result = new Array(itemCount);
        for (var i = 0; i < itemCount; i++) {
            result[i] = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(frame.content, i * BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES);
        }
        return result;
    };
    return ListLongCodec;
}());
exports.ListLongCodec = ListLongCodec;
//# sourceMappingURL=ListLongCodec.js.map