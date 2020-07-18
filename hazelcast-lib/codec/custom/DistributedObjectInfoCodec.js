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
var StringCodec_1 = require("../builtin/StringCodec");
var DistributedObjectInfo_1 = require("../../DistributedObjectInfo");
var DistributedObjectInfoCodec = /** @class */ (function () {
    function DistributedObjectInfoCodec() {
    }
    DistributedObjectInfoCodec.encode = function (clientMessage, distributedObjectInfo) {
        clientMessage.addFrame(ClientMessage_1.BEGIN_FRAME.copy());
        StringCodec_1.StringCodec.encode(clientMessage, distributedObjectInfo.serviceName);
        StringCodec_1.StringCodec.encode(clientMessage, distributedObjectInfo.name);
        clientMessage.addFrame(ClientMessage_1.END_FRAME.copy());
    };
    DistributedObjectInfoCodec.decode = function (clientMessage) {
        // begin frame
        clientMessage.nextFrame();
        var serviceName = StringCodec_1.StringCodec.decode(clientMessage);
        var name = StringCodec_1.StringCodec.decode(clientMessage);
        CodecUtil_1.CodecUtil.fastForwardToEndFrame(clientMessage);
        return new DistributedObjectInfo_1.DistributedObjectInfo(serviceName, name);
    };
    return DistributedObjectInfoCodec;
}());
exports.DistributedObjectInfoCodec = DistributedObjectInfoCodec;
//# sourceMappingURL=DistributedObjectInfoCodec.js.map