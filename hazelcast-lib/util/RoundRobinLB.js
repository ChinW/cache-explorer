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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractLoadBalancer_1 = require("./AbstractLoadBalancer");
var Util_1 = require("../Util");
// tslint:disable-next-line:no-bitwise
var INITIAL_SEED_CAP = 1 << 16;
/**
 * A {@link LoadBalancer} implementation that relies on using round robin
 * to a next member to send a request to.
 */
var RoundRobinLB = /** @class */ (function (_super) {
    __extends(RoundRobinLB, _super);
    function RoundRobinLB() {
        var _this = _super.call(this) || this;
        _this.index = Util_1.randomInt(INITIAL_SEED_CAP);
        return _this;
    }
    RoundRobinLB.prototype.next = function () {
        var members = this.getMembers();
        if (members == null || members.length === 0) {
            return null;
        }
        var length = members.length;
        var idx = (this.index++) % length;
        return members[idx];
    };
    return RoundRobinLB;
}(AbstractLoadBalancer_1.AbstractLoadBalancer));
exports.RoundRobinLB = RoundRobinLB;
//# sourceMappingURL=RoundRobinLB.js.map