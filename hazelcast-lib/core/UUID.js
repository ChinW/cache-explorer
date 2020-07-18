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
var Util_1 = require("../Util");
var UUID = /** @class */ (function () {
    function UUID(mostSig, leastSig) {
        this.mostSignificant = mostSig;
        this.leastSignificant = leastSig;
    }
    UUID.prototype.equals = function (other) {
        if (other == null) {
            return false;
        }
        return other.mostSignificant.equals(this.mostSignificant) && other.leastSignificant.equals(this.leastSignificant);
    };
    /* tslint:disable:no-bitwise */
    UUID.prototype.toString = function () {
        if (this.cachedString) {
            return this.cachedString;
        }
        var mostHigh = this.mostSignificant.getHighBitsUnsigned(); // (32) 32 32 32
        var mostLow = this.mostSignificant.getLowBitsUnsigned(); // 32 (32) 32 32
        var leastHigh = this.leastSignificant.getHighBitsUnsigned(); // 32 32 (32) 32
        var leastLow = this.leastSignificant.getLowBitsUnsigned(); // 32 32 32 (32)
        var div1 = mostHigh.toString(16);
        var div2 = (mostLow >>> 16).toString(16);
        var div3 = (mostLow & ((1 << 16) - 1)).toString(16);
        var div4 = (leastHigh >>> 16).toString(16);
        var div5 = (leastHigh & ((1 << 16) - 1)).toString(16) + Util_1.pad(leastLow.toString(16), 8, '0');
        this.cachedString = Util_1.pad(div1, 8, '0') + '-'
            + Util_1.pad(div2, 4, '0') + '-'
            + Util_1.pad(div3, 4, '0') + '-'
            + Util_1.pad(div4, 4, '0') + '-'
            + Util_1.pad(div5, 12, '0');
        return this.cachedString;
    };
    return UUID;
}());
exports.UUID = UUID;
//# sourceMappingURL=UUID.js.map