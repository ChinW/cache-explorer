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
var ListLongCodec_1 = require("./ListLongCodec");
var LongArrayCodec = /** @class */ (function () {
    function LongArrayCodec() {
    }
    LongArrayCodec.encode = function (clientMessage, array) {
        ListLongCodec_1.ListLongCodec.encode(clientMessage, array);
    };
    LongArrayCodec.decode = function (clientMessage) {
        return ListLongCodec_1.ListLongCodec.decode(clientMessage);
    };
    return LongArrayCodec;
}());
exports.LongArrayCodec = LongArrayCodec;
//# sourceMappingURL=LongArrayCodec.js.map