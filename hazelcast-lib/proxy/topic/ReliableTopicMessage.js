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
exports.RELIABLE_TOPIC_MESSAGE_FACTORY_ID = -9;
exports.RELIABLE_TOPIC_CLASS_ID = 2;
var ReliableTopicMessage = /** @class */ (function () {
    function ReliableTopicMessage() {
    }
    ReliableTopicMessage.prototype.readData = function (input) {
        this.publishTime = input.readLong();
        this.publisherAddress = input.readObject();
        this.payload = input.readData();
    };
    ReliableTopicMessage.prototype.writeData = function (output) {
        output.writeLong(this.publishTime);
        output.writeObject(this.publisherAddress);
        output.writeData(this.payload);
    };
    ReliableTopicMessage.prototype.getFactoryId = function () {
        return exports.RELIABLE_TOPIC_MESSAGE_FACTORY_ID;
    };
    ReliableTopicMessage.prototype.getClassId = function () {
        return exports.RELIABLE_TOPIC_CLASS_ID;
    };
    return ReliableTopicMessage;
}());
exports.ReliableTopicMessage = ReliableTopicMessage;
var ReliableTopicMessageFactory = /** @class */ (function () {
    function ReliableTopicMessageFactory() {
    }
    ReliableTopicMessageFactory.prototype.create = function (type) {
        if (type === exports.RELIABLE_TOPIC_CLASS_ID) {
            return new ReliableTopicMessage();
        }
        return null;
    };
    return ReliableTopicMessageFactory;
}());
exports.ReliableTopicMessageFactory = ReliableTopicMessageFactory;
//# sourceMappingURL=ReliableTopicMessage.js.map