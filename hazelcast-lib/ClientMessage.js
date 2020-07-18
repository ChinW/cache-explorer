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
/* tslint:disable:no-bitwise */
var BitsUtil_1 = require("./BitsUtil");
var FixSizedTypesCodec_1 = require("./codec/builtin/FixSizedTypesCodec");
var MESSAGE_TYPE_OFFSET = 0;
var CORRELATION_ID_OFFSET = MESSAGE_TYPE_OFFSET + BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES;
exports.RESPONSE_BACKUP_ACKS_OFFSET = CORRELATION_ID_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
exports.PARTITION_ID_OFFSET = CORRELATION_ID_OFFSET + BitsUtil_1.BitsUtil.LONG_SIZE_IN_BYTES;
var FRAGMENTATION_ID_OFFSET = 0;
exports.DEFAULT_FLAGS = 0;
var BEGIN_FRAGMENT_FLAG = 1 << 15;
var END_FRAGMENT_FLAG = 1 << 14;
var UNFRAGMENTED_MESSAGE = BEGIN_FRAGMENT_FLAG | END_FRAGMENT_FLAG;
var IS_FINAL_FLAG = 1 << 13;
var BEGIN_DATA_STRUCTURE_FLAG = 1 << 12;
var END_DATA_STRUCTURE_FLAG = 1 << 11;
var IS_NULL_FLAG = 1 << 10;
var IS_EVENT_FLAG = 1 << 9;
exports.SIZE_OF_FRAME_LENGTH_AND_FLAGS = BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES + BitsUtil_1.BitsUtil.SHORT_SIZE_IN_BYTES;
var Frame = /** @class */ (function () {
    function Frame(content, flags) {
        this.content = content;
        this.flags = flags || exports.DEFAULT_FLAGS;
    }
    Frame.createInitialFrame = function (size, flags) {
        if (flags === void 0) { flags = UNFRAGMENTED_MESSAGE; }
        return new Frame(Buffer.allocUnsafe(size), flags);
    };
    Frame.prototype.getLength = function () {
        return exports.SIZE_OF_FRAME_LENGTH_AND_FLAGS + this.content.length;
    };
    Frame.prototype.copy = function () {
        var frame = new Frame(this.content, this.flags);
        frame.next = this.next;
        return frame;
    };
    Frame.prototype.deepCopy = function () {
        var content = Buffer.from(this.content);
        var frame = new Frame(content, this.flags);
        frame.next = this.next;
        return frame;
    };
    Frame.prototype.isBeginFrame = function () {
        return this.isFlagSet(this.flags, BEGIN_DATA_STRUCTURE_FLAG);
    };
    Frame.prototype.isEndFrame = function () {
        return this.isFlagSet(this.flags, END_DATA_STRUCTURE_FLAG);
    };
    Frame.prototype.isNullFrame = function () {
        return this.isFlagSet(this.flags, IS_NULL_FLAG);
    };
    Frame.prototype.hasEventFlag = function () {
        return this.isFlagSet(this.flags, IS_EVENT_FLAG);
    };
    Frame.prototype.isFinalFrame = function () {
        return this.isFlagSet(this.flags, IS_FINAL_FLAG);
    };
    Frame.prototype.hasUnfragmentedMessageFlag = function () {
        return this.isFlagSet(this.flags, UNFRAGMENTED_MESSAGE);
    };
    Frame.prototype.hasBeginFragmentFlag = function () {
        return this.isFlagSet(this.flags, BEGIN_FRAGMENT_FLAG);
    };
    Frame.prototype.hasEndFragmentFlag = function () {
        return this.isFlagSet(this.flags, END_FRAGMENT_FLAG);
    };
    Frame.prototype.isFlagSet = function (flags, flagMask) {
        var i = flags & flagMask;
        return i === flagMask;
    };
    return Frame;
}());
exports.Frame = Frame;
exports.NULL_FRAME = new Frame(Buffer.allocUnsafe(0), IS_NULL_FLAG);
exports.BEGIN_FRAME = new Frame(Buffer.allocUnsafe(0), BEGIN_DATA_STRUCTURE_FLAG);
exports.END_FRAME = new Frame(Buffer.allocUnsafe(0), END_DATA_STRUCTURE_FLAG);
var ClientMessage = /** @class */ (function () {
    function ClientMessage(startFrame, endFrame) {
        this.startFrame = startFrame;
        this.endFrame = endFrame || startFrame;
        this._nextFrame = startFrame;
    }
    ClientMessage.createForEncode = function () {
        return new ClientMessage();
    };
    ClientMessage.createForDecode = function (startFrame, endFrame) {
        return new ClientMessage(startFrame, endFrame);
    };
    ClientMessage.prototype.getStartFrame = function () {
        return this.startFrame;
    };
    ClientMessage.prototype.nextFrame = function () {
        var result = this._nextFrame;
        if (this._nextFrame != null) {
            this._nextFrame = this._nextFrame.next;
        }
        return result;
    };
    ClientMessage.prototype.hasNextFrame = function () {
        return this._nextFrame != null;
    };
    ClientMessage.prototype.peekNextFrame = function () {
        return this._nextFrame;
    };
    ClientMessage.prototype.addFrame = function (frame) {
        frame.next = null;
        if (this.startFrame == null) {
            this.startFrame = frame;
            this.endFrame = frame;
            this._nextFrame = frame;
            return;
        }
        this.endFrame.next = frame;
        this.endFrame = frame;
    };
    ClientMessage.prototype.getMessageType = function () {
        return this.startFrame.content.readInt32LE(MESSAGE_TYPE_OFFSET);
    };
    ClientMessage.prototype.setMessageType = function (messageType) {
        this.startFrame.content.writeInt32LE(messageType, MESSAGE_TYPE_OFFSET);
    };
    ClientMessage.prototype.getCorrelationId = function () {
        return FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(this.startFrame.content, CORRELATION_ID_OFFSET).toNumber();
    };
    ClientMessage.prototype.setCorrelationId = function (correlationId) {
        FixSizedTypesCodec_1.FixSizedTypesCodec.encodeLong(this.startFrame.content, CORRELATION_ID_OFFSET, correlationId);
    };
    ClientMessage.prototype.getPartitionId = function () {
        return this.startFrame.content.readInt32LE(exports.PARTITION_ID_OFFSET);
    };
    ClientMessage.prototype.setPartitionId = function (partitionId) {
        this.startFrame.content.writeInt32LE(partitionId, exports.PARTITION_ID_OFFSET);
    };
    ClientMessage.prototype.getHeaderFlags = function () {
        return this.startFrame.flags;
    };
    ClientMessage.prototype.isRetryable = function () {
        return this.retryable;
    };
    ClientMessage.prototype.setRetryable = function (retryable) {
        this.retryable = retryable;
    };
    ClientMessage.prototype.getConnection = function () {
        return this.connection;
    };
    ClientMessage.prototype.setConnection = function (connection) {
        this.connection = connection;
    };
    ClientMessage.prototype.getTotalFrameLength = function () {
        var frameLength = 0;
        var currentFrame = this.startFrame;
        while (currentFrame != null) {
            frameLength += currentFrame.getLength();
            currentFrame = currentFrame.next;
        }
        return frameLength;
    };
    ClientMessage.prototype.getFragmentationId = function () {
        return FixSizedTypesCodec_1.FixSizedTypesCodec.decodeLong(this.startFrame.content, FRAGMENTATION_ID_OFFSET).toNumber();
    };
    ClientMessage.prototype.merge = function (fragment) {
        // Should be called after calling dropFragmentationFrame() on the fragment
        this.endFrame.next = fragment.startFrame;
        this.endFrame = fragment.endFrame;
    };
    ClientMessage.prototype.dropFragmentationFrame = function () {
        this.startFrame = this.startFrame.next;
        this._nextFrame = this._nextFrame.next;
    };
    ClientMessage.prototype.copyWithNewCorrelationId = function () {
        var startFrameCopy = this.startFrame.deepCopy();
        var newMessage = new ClientMessage(startFrameCopy, this.endFrame);
        newMessage.setCorrelationId(-1);
        newMessage.retryable = this.retryable;
        return newMessage;
    };
    ClientMessage.prototype.toBuffer = function () {
        var buffers = [];
        var totalLength = 0;
        var currentFrame = this.startFrame;
        while (currentFrame != null) {
            var isLastFrame = currentFrame.next == null;
            var frameLengthAndFlags = Buffer.allocUnsafe(exports.SIZE_OF_FRAME_LENGTH_AND_FLAGS);
            frameLengthAndFlags.writeInt32LE(currentFrame.content.length + exports.SIZE_OF_FRAME_LENGTH_AND_FLAGS, 0);
            if (isLastFrame) {
                // tslint:disable-next-line:no-bitwise
                frameLengthAndFlags.writeUInt16LE(currentFrame.flags | IS_FINAL_FLAG, BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES);
            }
            else {
                frameLengthAndFlags.writeUInt16LE(currentFrame.flags, BitsUtil_1.BitsUtil.INT_SIZE_IN_BYTES);
            }
            totalLength += exports.SIZE_OF_FRAME_LENGTH_AND_FLAGS;
            buffers.push(frameLengthAndFlags);
            totalLength += currentFrame.content.length;
            buffers.push(currentFrame.content);
            currentFrame = currentFrame.next;
        }
        return Buffer.concat(buffers, totalLength);
    };
    return ClientMessage;
}());
exports.ClientMessage = ClientMessage;
//# sourceMappingURL=ClientMessage.js.map