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
 * Configurations for LifecycleListeners. These are registered as soon as client started.
 */
var ListenerConfig = /** @class */ (function () {
    function ListenerConfig() {
        this.lifecycleListeners = [];
        this.membershipListeners = [];
    }
    ListenerConfig.prototype.addLifecycleListener = function (listener) {
        this.lifecycleListeners.push(listener);
    };
    ListenerConfig.prototype.addMembershipListener = function (listener) {
        this.membershipListeners.push(listener);
    };
    ListenerConfig.prototype.getLifecycleListeners = function () {
        return this.lifecycleListeners;
    };
    ListenerConfig.prototype.getMembershipListeners = function () {
        return this.membershipListeners;
    };
    return ListenerConfig;
}());
exports.ListenerConfig = ListenerConfig;
//# sourceMappingURL=ListenerConfig.js.map