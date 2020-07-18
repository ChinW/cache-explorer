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
var FlakeIdGeneratorConfig = /** @class */ (function () {
    function FlakeIdGeneratorConfig() {
        /**
         * Sets the name for this config.
         */
        this.name = 'default';
        /**
         * Sets how many IDs are pre-fetched on the background when a new flake id is requested
         * from servers. Default is 100.
         *
         * prefetch count should be in the range 1..100,000.
         */
        this.prefetchCount = 100;
        /**
         * Sets for how long the pre-fetched IDs can be used. If this time elapses, a new batch of IDs will be
         * fetched. Time unit is milliseconds, default is 600,000 (10 minutes).
         * <p>
         * The IDs contain timestamp component, which ensures rough global ordering of IDs. If an ID
         * is assigned to an object that was created much later, it will be much out of order. If you don't care
         * about ordering, set this value to 0.
         *
         * Set to the desired ID validity or 0 for unlimited.
         */
        this.prefetchValidityMillis = 600000;
    }
    FlakeIdGeneratorConfig.prototype.toString = function () {
        return 'FlakeIdGeneratorConfig[' +
            'name: ' + this.name + ', ' +
            'prefetchCount: ' + this.prefetchCount + ', ' +
            'prefetchValidityMillis: ' + this.prefetchValidityMillis + ']';
    };
    FlakeIdGeneratorConfig.prototype.clone = function () {
        var other = new FlakeIdGeneratorConfig();
        Object.assign(other, this);
        return other;
    };
    return FlakeIdGeneratorConfig;
}());
exports.FlakeIdGeneratorConfig = FlakeIdGeneratorConfig;
//# sourceMappingURL=FlakeIdGeneratorConfig.js.map