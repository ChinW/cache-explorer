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
var events_1 = require("events");
var Util = require("./Util");
/**
 * Lifecycle states.
 */
var LifecycleState;
(function (LifecycleState) {
    /**
     * Fired when the client is starting.
     */
    LifecycleState["STARTING"] = "STARTING";
    /**
     * Fired when the client's start is completed.
     */
    LifecycleState["STARTED"] = "STARTED";
    /**
     * Fired when the client is shutting down.
     */
    LifecycleState["SHUTTING_DOWN"] = "SHUTTING_DOWN";
    /**
     * Fired when the client's shut down is completed.
     */
    LifecycleState["SHUTDOWN"] = "SHUTDOWN";
    /**
     * Fired when the client is connected to the member.
     */
    LifecycleState["CONNECTED"] = "CONNECTED";
    /**
     * Fired when the client is disconnected from the member.
     */
    LifecycleState["DISCONNECTED"] = "DISCONNECTED";
    /**
     * Fired when the client is connected to a new cluster.
     */
    LifecycleState["CHANGED_CLUSTER"] = "CHANGED_CLUSTER";
})(LifecycleState = exports.LifecycleState || (exports.LifecycleState = {}));
var LIFECYCLE_EVENT_NAME = 'lifecycleEvent';
/**
 * LifecycleService
 */
var LifecycleService = /** @class */ (function (_super) {
    __extends(LifecycleService, _super);
    function LifecycleService(client) {
        var _this = _super.call(this) || this;
        _this.setMaxListeners(0);
        _this.client = client;
        _this.logger = _this.client.getLoggingService().getLogger();
        var listeners = client.getConfig().listeners.lifecycleListeners;
        listeners.forEach(function (listener) {
            _this.on(LIFECYCLE_EVENT_NAME, listener);
        });
        var listenerConfigs = client.getConfig().listenerConfigs;
        listenerConfigs.forEach(function (config) {
            if (config.type === 'lifecycle') {
                var path = config.importConfig.path;
                var exportedName = config.importConfig.exportedName;
                var listener = Util.loadNameFromPath(path, exportedName);
                _this.on(LIFECYCLE_EVENT_NAME, listener);
            }
        });
        return _this;
    }
    /**
     * Causes LifecycleService to emit given event to all registered listeners.
     * @param state
     */
    LifecycleService.prototype.emitLifecycleEvent = function (state) {
        this.logger.info('LifecycleService', 'HazelcastClient is ' + state);
        this.emit(LIFECYCLE_EVENT_NAME, state);
    };
    /**
     * Returns the active state of the client.
     * @returns {boolean}
     */
    LifecycleService.prototype.isRunning = function () {
        return this.active;
    };
    LifecycleService.prototype.start = function () {
        this.emitLifecycleEvent(LifecycleState.STARTING);
        this.active = true;
        this.emitLifecycleEvent(LifecycleState.STARTED);
    };
    LifecycleService.prototype.shutdown = function () {
        if (!this.active) {
            return;
        }
        this.active = false;
        this.emitLifecycleEvent(LifecycleState.SHUTTING_DOWN);
        this.client.doShutdown();
        this.emitLifecycleEvent(LifecycleState.SHUTDOWN);
    };
    return LifecycleService;
}(events_1.EventEmitter));
exports.LifecycleService = LifecycleService;
//# sourceMappingURL=LifecycleService.js.map