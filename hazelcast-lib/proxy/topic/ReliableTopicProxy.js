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
var Promise = require("bluebird");
var OverflowPolicy_1 = require("../../core/OverflowPolicy");
var HazelcastError_1 = require("../../HazelcastError");
var UuidUtil_1 = require("../../util/UuidUtil");
var BaseProxy_1 = require("../BaseProxy");
var ReliableTopicMessage_1 = require("./ReliableTopicMessage");
var ReliableTopicListenerRunner_1 = require("./ReliableTopicListenerRunner");
var TopicOverloadPolicy_1 = require("./TopicOverloadPolicy");
var Long = require("long");
exports.TOPIC_INITIAL_BACKOFF = 100;
exports.TOPIC_MAX_BACKOFF = 2000;
var ReliableTopicProxy = /** @class */ (function (_super) {
    __extends(ReliableTopicProxy, _super);
    function ReliableTopicProxy(client, serviceName, name) {
        var _this = _super.call(this, client, serviceName, name) || this;
        _this.runners = {};
        _this.localAddress = client.getClusterService().getLocalClient().localAddress;
        var config = client.getConfig().getReliableTopicConfig(name);
        _this.batchSize = config.readBatchSize;
        _this.overloadPolicy = config.overloadPolicy;
        _this.serializationService = client.getSerializationService();
        _this.name = name;
        return _this;
    }
    ReliableTopicProxy.prototype.setRingbuffer = function (ringbuffer) {
        this.ringbuffer = ringbuffer;
    };
    ReliableTopicProxy.prototype.addMessageListener = function (listener) {
        var listenerId = UuidUtil_1.UuidUtil.generate().toString();
        var runner = new ReliableTopicListenerRunner_1.ReliableTopicListenerRunner(listenerId, listener, this.ringbuffer, this.batchSize, this.serializationService, this.client.getLoggingService().getLogger(), this);
        this.runners[listenerId] = runner;
        this.ringbuffer.tailSequence().then(function (sequence) {
            runner.sequenceNumber = sequence.toNumber() + 1;
            runner.next();
        });
        return listenerId;
    };
    ReliableTopicProxy.prototype.removeMessageListener = function (id) {
        var runner = this.runners[id];
        if (!runner) {
            return false;
        }
        runner.cancel();
        delete this.runners[id];
        return true;
    };
    ReliableTopicProxy.prototype.publish = function (message) {
        var reliableTopicMessage = new ReliableTopicMessage_1.ReliableTopicMessage();
        reliableTopicMessage.payload = this.serializationService.toData(message);
        reliableTopicMessage.publishTime = Long.fromNumber(Date.now());
        reliableTopicMessage.publisherAddress = this.localAddress;
        switch (this.overloadPolicy) {
            case TopicOverloadPolicy_1.TopicOverloadPolicy.ERROR:
                return this.addWithError(reliableTopicMessage);
            case TopicOverloadPolicy_1.TopicOverloadPolicy.DISCARD_NEWEST:
                return this.addOrDiscard(reliableTopicMessage);
            case TopicOverloadPolicy_1.TopicOverloadPolicy.DISCARD_OLDEST:
                return this.addOrOverwrite(reliableTopicMessage);
            case TopicOverloadPolicy_1.TopicOverloadPolicy.BLOCK:
                return this.addWithBackoff(reliableTopicMessage);
            default:
                throw new RangeError('Unknown overload policy');
        }
    };
    ReliableTopicProxy.prototype.getRingbuffer = function () {
        return this.ringbuffer;
    };
    ReliableTopicProxy.prototype.destroy = function () {
        for (var k in this.runners) {
            var runner = this.runners[k];
            runner.cancel();
        }
        return this.ringbuffer.destroy();
    };
    ReliableTopicProxy.prototype.addOrDiscard = function (reliableTopicMessage) {
        return this.ringbuffer.add(reliableTopicMessage, OverflowPolicy_1.OverflowPolicy.FAIL).then(function () {
            return null;
        });
    };
    ReliableTopicProxy.prototype.addWithError = function (reliableTopicMessage) {
        var _this = this;
        return this.ringbuffer.add(reliableTopicMessage, OverflowPolicy_1.OverflowPolicy.FAIL).then(function (seq) {
            if (seq.toNumber() === -1) {
                throw new HazelcastError_1.TopicOverloadError('Failed to publish message: ' + reliableTopicMessage +
                    ' on topic: ' + _this.getName());
            }
            return null;
        });
    };
    ReliableTopicProxy.prototype.addOrOverwrite = function (reliableTopicMessage) {
        return this.ringbuffer.add(reliableTopicMessage, OverflowPolicy_1.OverflowPolicy.OVERWRITE).then(function () {
            return null;
        });
    };
    ReliableTopicProxy.prototype.addWithBackoff = function (reliableTopicMessage) {
        var resolve;
        var promise = new Promise(function () {
            resolve = arguments[0];
        });
        this.trySendMessage(reliableTopicMessage, exports.TOPIC_INITIAL_BACKOFF, resolve);
        return promise;
    };
    ReliableTopicProxy.prototype.trySendMessage = function (message, delay, resolve) {
        var _this = this;
        this.ringbuffer.add(message, OverflowPolicy_1.OverflowPolicy.FAIL).then(function (seq) {
            if (seq.toNumber() === -1) {
                var newDelay = delay *= 2;
                if (newDelay > exports.TOPIC_MAX_BACKOFF) {
                    newDelay = exports.TOPIC_MAX_BACKOFF;
                }
                _this.trySendMessage(message, newDelay, resolve);
            }
            else {
                resolve();
            }
        });
    };
    return ReliableTopicProxy;
}(BaseProxy_1.BaseProxy));
exports.ReliableTopicProxy = ReliableTopicProxy;
//# sourceMappingURL=ReliableTopicProxy.js.map