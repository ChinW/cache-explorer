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
/**
 * A {@link LoadBalancer} that selects a random member to route to.
 */
var RandomLB = /** @class */ (function (_super) {
    __extends(RandomLB, _super);
    function RandomLB() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RandomLB.prototype.next = function () {
        var members = this.getMembers();
        if (members == null || members.length === 0) {
            return null;
        }
        var index = Util_1.randomInt(members.length);
        return members[index];
    };
    return RandomLB;
}(AbstractLoadBalancer_1.AbstractLoadBalancer));
exports.RandomLB = RandomLB;
//# sourceMappingURL=RandomLB.js.map