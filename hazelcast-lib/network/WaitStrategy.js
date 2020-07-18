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
var Promise = require("bluebird");
var WaitStrategy = /** @class */ (function () {
    function WaitStrategy(initialBackoffMillis, maxBackoffMillis, multiplier, clusterConnectTimeoutMillis, jitter, logger) {
        this.initialBackoffMillis = initialBackoffMillis;
        this.maxBackoffMillis = maxBackoffMillis;
        this.multiplier = multiplier;
        this.clusterConnectTimeoutMillis = clusterConnectTimeoutMillis;
        this.jitter = jitter;
        this.logger = logger;
    }
    WaitStrategy.prototype.reset = function () {
        this.attempt = 0;
        this.clusterConnectAttemptBegin = Date.now();
        this.currentBackoffMillis = Math.min(this.maxBackoffMillis, this.initialBackoffMillis);
    };
    WaitStrategy.prototype.sleep = function () {
        var _this = this;
        this.attempt++;
        var currentTimeMillis = Date.now();
        var timePassed = currentTimeMillis - this.clusterConnectAttemptBegin;
        if (timePassed > this.clusterConnectTimeoutMillis) {
            this.logger.warn('WaitStrategy', 'Unable to get live cluster connection, cluster connect timeout (' +
                this.clusterConnectTimeoutMillis + ' millis) is reached. Attempt ' + this.attempt);
            return Promise.resolve(false);
        }
        // random_between
        // Random(-jitter * current_backoff, jitter * current_backoff)
        var actualSleepTime = this.currentBackoffMillis
            + this.currentBackoffMillis * this.jitter * (2.0 * Math.random() - 1.0);
        actualSleepTime = Math.min(actualSleepTime, this.clusterConnectTimeoutMillis - timePassed);
        this.logger.warn('WaitStrategy', 'Unable to get live cluster connection, retry in ' +
            actualSleepTime + ' ms, attempt: ' + this.attempt + ', cluster connect timeout: ' +
            this.clusterConnectTimeoutMillis + ' ms, max backoff millis: ' + this.maxBackoffMillis);
        return Promise.delay(actualSleepTime)
            .then(function () {
            _this.currentBackoffMillis = Math.min(Math.round(currentTimeMillis * _this.multiplier), _this.maxBackoffMillis);
            return true;
        });
    };
    return WaitStrategy;
}());
exports.WaitStrategy = WaitStrategy;
//# sourceMappingURL=WaitStrategy.js.map