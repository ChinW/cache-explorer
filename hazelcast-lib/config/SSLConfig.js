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
/**
 * SSL configuration.
 */
var SSLConfig = /** @class */ (function () {
    function SSLConfig() {
        /**
         * If it is true, SSL is enabled.
         */
        this.enabled = false;
        /**
         * sslOptions is by default null which means the following default configuration
         * is used while connecting to the server.
         *
         * {
         *   checkServerIdentity: (): any => null,
         *   rejectUnauthorized: true,
         * };
         *
         * If you want to override the default behavior, you can write your own connection sslOptions.
         */
        this.sslOptions = null;
        /**
         * sslOptionsFactoryConfig is config for ssl options factory. If you don't specify the path, BasicSSLOptionsFactory is used
         * by default.
         */
        this.sslOptionsFactoryConfig = null;
        /**
         * sslOptionsFactoryProperties is the properties to be set for ssl options.
         */
        this.sslOptionsFactoryProperties = null;
    }
    return SSLConfig;
}());
exports.SSLConfig = SSLConfig;
//# sourceMappingURL=SSLConfig.js.map