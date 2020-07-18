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
/* tslint:disable:no-bitwise */
var Long = require("long");
var UUID_1 = require("../core/UUID");
var INT_BOUND = 0xFFFFFFFF;
function randomUInt() {
    return Math.floor(Math.random() * INT_BOUND);
}
var UuidUtil = /** @class */ (function () {
    function UuidUtil() {
    }
    UuidUtil.generate = function (isUnsigned) {
        if (isUnsigned === void 0) { isUnsigned = true; }
        var mostS = new Long(randomUInt(), randomUInt(), isUnsigned);
        var leastS = new Long(randomUInt(), randomUInt(), isUnsigned);
        return new UUID_1.UUID(mostS, leastS);
    };
    return UuidUtil;
}());
exports.UuidUtil = UuidUtil;
//# sourceMappingURL=UuidUtil.js.map