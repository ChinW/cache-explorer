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
var FlakeIdGeneratorNewIdBatchCodec_1 = require("../codec/FlakeIdGeneratorNewIdBatchCodec");
var BaseProxy_1 = require("./BaseProxy");
var AutoBatcher_1 = require("./flakeid/AutoBatcher");
var FlakeIdGeneratorProxy = /** @class */ (function (_super) {
    __extends(FlakeIdGeneratorProxy, _super);
    function FlakeIdGeneratorProxy(client, serviceName, name) {
        var _this = _super.call(this, client, serviceName, name) || this;
        _this.config = client.getConfig().getFlakeIdGeneratorConfig(name);
        _this.autoBatcher = new AutoBatcher_1.AutoBatcher(function () {
            return _this.encodeInvokeOnRandomTarget(FlakeIdGeneratorNewIdBatchCodec_1.FlakeIdGeneratorNewIdBatchCodec, _this.config.prefetchCount)
                .then(function (clientMessage) {
                var response = FlakeIdGeneratorNewIdBatchCodec_1.FlakeIdGeneratorNewIdBatchCodec.decodeResponse(clientMessage);
                return new AutoBatcher_1.Batch(_this.config.prefetchValidityMillis, response.base, response.increment, response.batchSize);
            });
        });
        return _this;
    }
    FlakeIdGeneratorProxy.prototype.newId = function () {
        return this.autoBatcher.nextId();
    };
    return FlakeIdGeneratorProxy;
}(BaseProxy_1.BaseProxy));
exports.FlakeIdGeneratorProxy = FlakeIdGeneratorProxy;
//# sourceMappingURL=FlakeIdGeneratorProxy.js.map