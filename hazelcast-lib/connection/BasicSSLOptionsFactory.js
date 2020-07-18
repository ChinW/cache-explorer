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
var fs = require("fs");
var HazelcastError_1 = require("../HazelcastError");
var Util_1 = require("../Util");
var BasicSSLOptionsFactory = /** @class */ (function () {
    function BasicSSLOptionsFactory() {
    }
    BasicSSLOptionsFactory.prototype.init = function (properties) {
        var _this = this;
        if (typeof properties !== 'object') {
            throw new HazelcastError_1.HazelcastError('properties is not an object');
        }
        var promises = [];
        var readFile = Promise.promisify(fs.readFile);
        var caPath = Util_1.getStringOrUndefined(properties.caPath);
        var keyPath = Util_1.getStringOrUndefined(properties.keyPath);
        var certPath = Util_1.getStringOrUndefined(properties.certPath);
        if (caPath !== undefined) {
            promises.push(readFile(Util_1.resolvePath(caPath)).then(function (data) {
                _this.ca = data;
            }));
        }
        if (keyPath !== undefined) {
            promises.push(readFile(Util_1.resolvePath(keyPath)).then(function (data) {
                _this.key = data;
            }));
        }
        if (certPath !== undefined) {
            promises.push(readFile(Util_1.resolvePath(certPath)).then(function (data) {
                _this.cert = data;
            }));
        }
        this.servername = Util_1.getStringOrUndefined(properties.servername);
        this.rejectUnauthorized = Util_1.getBooleanOrUndefined(properties.rejectUnauthorized);
        this.ciphers = Util_1.getStringOrUndefined(properties.ciphers);
        return Promise.all(promises)
            .then(function () { return undefined; });
    };
    BasicSSLOptionsFactory.prototype.getSSLOptions = function () {
        return {
            servername: this.servername,
            rejectUnauthorized: this.rejectUnauthorized,
            ca: this.ca,
            key: this.key,
            cert: this.cert,
            ciphers: this.ciphers,
        };
    };
    return BasicSSLOptionsFactory;
}());
exports.BasicSSLOptionsFactory = BasicSSLOptionsFactory;
//# sourceMappingURL=BasicSSLOptionsFactory.js.map