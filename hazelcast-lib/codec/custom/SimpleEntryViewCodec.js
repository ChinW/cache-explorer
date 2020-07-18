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
var DataCodec_1 = require("../builtin/DataCodec");
var SimpleEntryView_1 = require("../../core/SimpleEntryView");
var COST_OFFSET = 0;
var CREATION_TIME_OFFSET = COST_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var EXPIRATION_TIME_OFFSET = CREATION_TIME_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var HITS_OFFSET = EXPIRATION_TIME_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var LAST_ACCESS_TIME_OFFSET = HITS_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var LAST_STORED_TIME_OFFSET = LAST_ACCESS_TIME_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var LAST_UPDATE_TIME_OFFSET = LAST_STORED_TIME_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var VERSION_OFFSET = LAST_UPDATE_TIME_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var TTL_OFFSET = VERSION_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var MAX_IDLE_OFFSET = TTL_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var INITIAL_FRAME_SIZE = MAX_IDLE_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var SimpleEntryViewCodec = /** @class */ (function () {
    function SimpleEntryViewCodec() {
    }
    SimpleEntryViewCodec.encode = function (clientMessage, simpleEntryView) {
        clientMessage.addFrame(ClientMessage_1.BEGIN_FRAME.copy());
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(INITIAL_FRAME_SIZE, ClientMessage_1.DEFAULT_FLAGS);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(initialFrame.content, COST_OFFSET, simpleEntryView.cost);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(initialFrame.content, CREATION_TIME_OFFSET, simpleEntryView.creationTime);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(initialFrame.content, EXPIRATION_TIME_OFFSET, simpleEntryView.expirationTime);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(initialFrame.content, HITS_OFFSET, simpleEntryView.hits);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(initialFrame.content, LAST_ACCESS_TIME_OFFSET, simpleEntryView.lastAccessTime);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(initialFrame.content, LAST_STORED_TIME_OFFSET, simpleEntryView.lastStoredTime);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(initialFrame.content, LAST_UPDATE_TIME_OFFSET, simpleEntryView.lastUpdateTime);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(initialFrame.content, VERSION_OFFSET, simpleEntryView.version);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(initialFrame.content, TTL_OFFSET, simpleEntryView.ttl);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(initialFrame.content, MAX_IDLE_OFFSET, simpleEntryView.maxIdle);
        clientMessage.addFrame(initialFrame);
        DataCodec_1.DataCodec.encode(clientMessage, simpleEntryView.key);
        DataCodec_1.DataCodec.encode(clientMessage, simpleEntryView.value);
        clientMessage.addFrame(ClientMessage_1.END_FRAME.copy());
    };
    SimpleEntryViewCodec.decode = function (clientMessage) {
        // begin frame
        clientMessage.nextFrame();
        var initialFrame = clientMessage.nextFrame();
        var cost = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(initialFrame.content, COST_OFFSET);
        var creationTime = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(initialFrame.content, CREATION_TIME_OFFSET);
        var expirationTime = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(initialFrame.content, EXPIRATION_TIME_OFFSET);
        var hits = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(initialFrame.content, HITS_OFFSET);
        var lastAccessTime = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(initialFrame.content, LAST_ACCESS_TIME_OFFSET);
        var lastStoredTime = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(initialFrame.content, LAST_STORED_TIME_OFFSET);
        var lastUpdateTime = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(initialFrame.content, LAST_UPDATE_TIME_OFFSET);
        var version = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(initialFrame.content, VERSION_OFFSET);
        var ttl = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(initialFrame.content, TTL_OFFSET);
        var maxIdle = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(initialFrame.content, MAX_IDLE_OFFSET);
        var key = DataCodec_1.DataCodec.decode(clientMessage);
        var value = DataCodec_1.DataCodec.decode(clientMessage);
        CodecUtil_1.CodecUtil.fastForwardToEndFrame(clientMessage);
        return new SimpleEntryView_1.SimpleEntryView(key, value, cost, creationTime, expirationTime, hits, lastAccessTime, lastStoredTime, lastUpdateTime, version, ttl, maxIdle);
    };
    return SimpleEntryViewCodec;
}());
exports.SimpleEntryViewCodec = SimpleEntryViewCodec;
//# sourceMappingURL=SimpleEntryViewCodec.js.map