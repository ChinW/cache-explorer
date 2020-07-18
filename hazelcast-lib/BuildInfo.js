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
var clientVersion = require('../package.json').version;
var BuildInfo = /** @class */ (function () {
    function BuildInfo() {
    }
    BuildInfo.calculateServerVersionFromString = function (versionString) {
        if (versionString == null) {
            return BuildInfo.UNKNOWN_VERSION_ID;
        }
        var info = BuildInfo.PATTERN.exec(versionString);
        if (info == null) {
            return -1;
        }
        var major = Number.parseInt(info[1]);
        var minor = Number.parseInt(info[2]);
        var patch;
        if (info[3] == null) {
            patch = 0;
        }
        else {
            patch = Number.parseInt(info[3]);
        }
        return this.calculateServerVersion(major, minor, patch);
    };
    BuildInfo.calculateServerVersion = function (major, minor, patch) {
        return BuildInfo.MAJOR_VERSION_MULTIPLIER * major + BuildInfo.MINOR_VERSION_MULTIPLIER * minor + patch;
    };
    BuildInfo.getClientVersion = function () {
        return clientVersion;
    };
    BuildInfo.UNKNOWN_VERSION_ID = -1;
    BuildInfo.MAJOR_VERSION_MULTIPLIER = 10000;
    BuildInfo.MINOR_VERSION_MULTIPLIER = 100;
    BuildInfo.PATTERN = /^([\d]+)\.([\d]+)(?:\.([\d]+))?(-[\w]+)?(-SNAPSHOT)?(-BETA-.)?$/;
    return BuildInfo;
}());
exports.BuildInfo = BuildInfo;
//# sourceMappingURL=BuildInfo.js.map