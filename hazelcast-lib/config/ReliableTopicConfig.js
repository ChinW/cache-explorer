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
var TopicOverloadPolicy_1 = require("../proxy/topic/TopicOverloadPolicy");
var ReliableTopicConfig = /** @class */ (function () {
    function ReliableTopicConfig() {
        this.name = 'default';
        this.readBatchSize = 10;
        this.overloadPolicy = TopicOverloadPolicy_1.TopicOverloadPolicy.BLOCK;
    }
    ReliableTopicConfig.prototype.toString = function () {
        return 'ReliableTopicConfig[' +
            'name: ' + this.name + ', ' +
            'readBatchSize: ' + this.readBatchSize + ', ' +
            'overloadPolicy: ' + this.overloadPolicy + ']';
    };
    ReliableTopicConfig.prototype.clone = function () {
        var other = new ReliableTopicConfig();
        Object.assign(other, this);
        return other;
    };
    return ReliableTopicConfig;
}());
exports.ReliableTopicConfig = ReliableTopicConfig;
//# sourceMappingURL=ReliableTopicConfig.js.map