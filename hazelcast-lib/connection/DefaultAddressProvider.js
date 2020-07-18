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
/**
 * Default address provider of Hazelcast.
 *
 * Loads addresses from the Hazelcast configuration.
 */
var DefaultAddressProvider = /** @class */ (function () {
    function DefaultAddressProvider(networkConfig) {
        this.networkConfig = networkConfig;
    }
    DefaultAddressProvider.prototype.loadAddresses = function () {
        var addresses = this.networkConfig.addresses;
        if (addresses.length === 0) {
            addresses.push('localhost');
        }
        return Promise.resolve(addresses);
    };
    DefaultAddressProvider.prototype.translate = function (address) {
        return Promise.resolve(address);
    };
    return DefaultAddressProvider;
}());
exports.DefaultAddressProvider = DefaultAddressProvider;
//# sourceMappingURL=DefaultAddressProvider.js.map