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
var ClientMessage_1 = require("../../ClientMessage");
var CodecUtil_1 = require("../builtin/CodecUtil");
var ListIntegerCodec_1 = require("../builtin/ListIntegerCodec");
var EntryListCodec_1 = require("../builtin/EntryListCodec");
var DataCodec_1 = require("../builtin/DataCodec");
var AnchorDataListHolder_1 = require("../../protocol/AnchorDataListHolder");
var AnchorDataListHolderCodec = /** @class */ (function () {
    function AnchorDataListHolderCodec() {
    }
    AnchorDataListHolderCodec.encode = function (clientMessage, anchorDataListHolder) {
        clientMessage.addFrame(ClientMessage_1.BEGIN_FRAME.copy());
        ListIntegerCodec_1.ListIntegerCodec.encode(clientMessage, anchorDataListHolder.anchorPageList);
        EntryListCodec_1.EntryListCodec.encode(clientMessage, anchorDataListHolder.anchorDataList, DataCodec_1.DataCodec.encode, DataCodec_1.DataCodec.encode);
        clientMessage.addFrame(ClientMessage_1.END_FRAME.copy());
    };
    AnchorDataListHolderCodec.decode = function (clientMessage) {
        // begin frame
        clientMessage.nextFrame();
        var anchorPageList = ListIntegerCodec_1.ListIntegerCodec.decode(clientMessage);
        var anchorDataList = EntryListCodec_1.EntryListCodec.decode(clientMessage, DataCodec_1.DataCodec.decode, DataCodec_1.DataCodec.decode);
        CodecUtil_1.CodecUtil.fastForwardToEndFrame(clientMessage);
        return new AnchorDataListHolder_1.AnchorDataListHolder(anchorPageList, anchorDataList);
    };
    return AnchorDataListHolderCodec;
}());
exports.AnchorDataListHolderCodec = AnchorDataListHolderCodec;
//# sourceMappingURL=AnchorDataListHolderCodec.js.map