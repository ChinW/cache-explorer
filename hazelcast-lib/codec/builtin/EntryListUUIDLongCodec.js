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
var BitsUtil_1 = require("../../BitsUtil");
var ClientMessage_1 = require("../../ClientMessage");
var FixSizedTypesCodec_1 = require("./FixSizedTypesCodec");
var ENTRY_SIZE_IN_BYTES = BitsUtil_1.BitsUtil.UUID_SIZE_IN_BYTES + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var EntryListUUIDLongCodec = /** @class */ (function () {
    function EntryListUUIDLongCodec() {
    }
    EntryListUUIDLongCodec.encode = function (clientMessage, entries) {
        var entryCount = entries.length;
        var frame = new ClientMessage_1.Frame(Buffer.allocUnsafe(entryCount * ENTRY_SIZE_IN_BYTES));
        for (var i = 0; i < entryCount; i++) {
            FixSizedTypesCodec_1.FixSizedTypesCodec.encodeUUID(frame.content, i * ENTRY_SIZE_IN_BYTES, entries[i][0]);
            FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(frame.content, i * ENTRY_SIZE_IN_BYTES + BitsUtil_1.BitsUtil.UUID_SIZE_IN_BYTES, entries[i][1]);
        }
        clientMessage.addFrame(frame);
    };
    EntryListUUIDLongCodec.decode = function (clientMessage) {
        var frame = clientMessage.nextFrame();
        var entryCount = frame.content.length / ENTRY_SIZE_IN_BYTES;
        var result = new Array(entryCount);
        for (var i = 0; i < entryCount; i++) {
            var key = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeUUID(frame.content, i * ENTRY_SIZE_IN_BYTES);
            var value = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(frame.content, i * ENTRY_SIZE_IN_BYTES + BitsUtil_1.BitsUtil.UUID_SIZE_IN_BYTES);
            result[i] = [key, value];
        }
        return result;
    };
    return EntryListUUIDLongCodec;
}());
exports.EntryListUUIDLongCodec = EntryListUUIDLongCodec;
//# sourceMappingURL=EntryListUUIDLongCodec.js.map