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
var Address_1 = require("../../Address");
var PORT_OFFSET = 0;
var INITIAL_FRAME_SIZE = PORT_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
var AddressCodec = /** @class */ (function () {
    function AddressCodec() {
    }
    AddressCodec.encode = function (clientMessage, address) {
        clientMessage.addFrame(ClientMessage_1.BEGIN_FRAME.copy());
        var initialFrame = ClientMessage_1.Frame.createInitialFrame(INITIAL_FRAME_SIZE, ClientMessage_1.DEFAULT_FLAGS);
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeInt(initialFrame.content, PORT_OFFSET, address.port);
        clientMessage.addFrame(initialFrame);
        StringCodec_1.StringCodec.encode(clientMessage, address.host);
        clientMessage.addFrame(ClientMessage_1.END_FRAME.copy());
    };
    AddressCodec.decode = function (clientMessage) {
        // begin frame
        clientMessage.nextFrame();
        var initialFrame = clientMessage.nextFrame();
        var port = FixSizedTypesCodec_1.FixSizedTypesCodec.decodeInt(initialFrame.content, PORT_OFFSET);
        var host = StringCodec_1.StringCodec.decode(clientMessage);
        CodecUtil_1.CodecUtil.fastForwardToEndFrame(clientMessage);
        return new Address_1.Address(host, port);
    };
    return AddressCodec;
}());
exports.AddressCodec = AddressCodec;
//# sourceMappingURL=AddressCodec.js.map