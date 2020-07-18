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
var HazelcastError_1 = require("../HazelcastError");
var ClientProtocolErrorCodes_1 = require("./ClientProtocolErrorCodes");
var ErrorsCodec_1 = require("../codec/builtin/ErrorsCodec");
var ClientErrorFactory = /** @class */ (function () {
    function ClientErrorFactory() {
        this.codeToErrorConstructor = new Map();
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.ARRAY_INDEX_OUT_OF_BOUNDS, function (m, c) { return new RangeError(m); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.ARRAY_STORE, function (m, c) { return new TypeError(m); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.AUTHENTICATION, function (m, c) { return new HazelcastError_1.AuthenticationError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.CALLER_NOT_MEMBER, function (m, c) { return new HazelcastError_1.CallerNotMemberError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.CANCELLATION, function (m, c) { return new HazelcastError_1.CancellationError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.CLASS_CAST, function (m, c) { return new HazelcastError_1.ClassCastError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.CLASS_NOT_FOUND, function (m, c) { return new HazelcastError_1.ClassNotFoundError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.CONCURRENT_MODIFICATION, function (m, c) { return new HazelcastError_1.ConcurrentModificationError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.CONFIG_MISMATCH, function (m, c) { return new HazelcastError_1.ConfigMismatchError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.DISTRIBUTED_OBJECT_DESTROYED, function (m, c) { return new HazelcastError_1.DistributedObjectDestroyedError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.EOF, function (m, c) { return new HazelcastError_1.IOError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.HAZELCAST, function (m, c) { return new HazelcastError_1.HazelcastError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.HAZELCAST_INSTANCE_NOT_ACTIVE, function (m, c) { return new HazelcastError_1.HazelcastInstanceNotActiveError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.HAZELCAST_OVERLOAD, function (m, c) { return new HazelcastError_1.HazelcastError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.HAZELCAST_SERIALIZATION, function (m, c) { return new HazelcastError_1.HazelcastSerializationError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.IO, function (m, c) { return new HazelcastError_1.IOError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.ILLEGAL_ARGUMENT, function (m, c) { return new TypeError(m); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.ILLEGAL_STATE, function (m, c) { return new HazelcastError_1.IllegalStateError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.INDEX_OUT_OF_BOUNDS, function (m, c) { return new RangeError(m); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.INTERRUPTED, function (m, c) { return new Error(m); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.INVALID_ADDRESS, function (m, c) { return new TypeError(m); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.INVALID_CONFIGURATION, function (m, c) { return new TypeError(m); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.MEMBER_LEFT, function (m, c) { return new HazelcastError_1.MemberLeftError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.NEGATIVE_ARRAY_SIZE, function (m, c) { return new RangeError(m); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.NO_SUCH_ELEMENT, function (m, c) { return new ReferenceError(m); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.NOT_SERIALIZABLE, function (m, c) { return new HazelcastError_1.IOError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.NULL_POINTER, function (m, c) { return new ReferenceError(m); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.OPERATION_TIMEOUT, function (m, c) { return new HazelcastError_1.InvocationTimeoutError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.PARTITION_MIGRATING, function (m, c) { return new HazelcastError_1.PartitionMigratingError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.QUERY, function (m, c) { return new HazelcastError_1.QueryError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.QUERY_RESULT_SIZE_EXCEEDED, function (m, c) { return new HazelcastError_1.QueryError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.SPLIT_BRAIN_PROTECTION, function (m, c) { return new HazelcastError_1.SplitBrainProtectionError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.RETRYABLE_HAZELCAST, function (m, c) { return new HazelcastError_1.RetryableHazelcastError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.RETRYABLE_IO, function (m, c) { return new HazelcastError_1.RetryableIOError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.SOCKET, function (m, c) { return new HazelcastError_1.IOError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.STALE_SEQUENCE, function (m, c) { return new HazelcastError_1.StaleSequenceError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.TARGET_DISCONNECTED, function (m, c) { return new HazelcastError_1.TargetDisconnectedError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.TARGET_NOT_MEMBER, function (m, c) { return new HazelcastError_1.TargetNotMemberError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.TOPIC_OVERLOAD, function (m, c) { return new HazelcastError_1.TopicOverloadError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.TRANSACTION, function (m, c) { return new HazelcastError_1.TransactionError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.TRANSACTION_NOT_ACTIVE, function (m, c) { return new HazelcastError_1.TransactionNotActiveError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.TRANSACTION_TIMED_OUT, function (m, c) { return new HazelcastError_1.TransactionTimedOutError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.UNSUPPORTED_OPERATION, function (m, c) { return new HazelcastError_1.UnsupportedOperationError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.NO_DATA_MEMBER, function (m, c) { return new HazelcastError_1.NoDataMemberInClusterError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.STALE_TASK_ID, function (m, c) { return new HazelcastError_1.StaleTaskIdError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.FLAKE_ID_NODE_ID_OUT_OF_RANGE_EXCEPTION, function (m, c) { return new HazelcastError_1.NodeIdOutOfRangeError(m, c); });
        this.register(ClientProtocolErrorCodes_1.ClientProtocolErrorCodes.CONSISTENCY_LOST_EXCEPTION, function (m, c) { return new HazelcastError_1.ConsistencyLostError(m, c); });
    }
    ClientErrorFactory.prototype.createErrorFromClientMessage = function (clientMessage) {
        var errorHolders = ErrorsCodec_1.ErrorsCodec.decode(clientMessage);
        return this.createError(errorHolders, 0);
    };
    ClientErrorFactory.prototype.createError = function (errorHolders, errorHolderIdx) {
        if (errorHolderIdx === errorHolders.length) {
            return null;
        }
        var errorHolder = errorHolders[errorHolderIdx];
        var factoryFunc = this.codeToErrorConstructor.get(errorHolder.errorCode);
        var error;
        if (factoryFunc != null) {
            error = factoryFunc(errorHolder.message, this.createError(errorHolders, errorHolderIdx + 1));
        }
        else {
            error = new HazelcastError_1.UndefinedErrorCodeError(errorHolder.message, errorHolder.className);
        }
        return error;
    };
    ClientErrorFactory.prototype.register = function (code, errorFactory) {
        this.codeToErrorConstructor.set(code, errorFactory);
    };
    return ClientErrorFactory;
}());
exports.ClientErrorFactory = ClientErrorFactory;
//# sourceMappingURL=ErrorFactory.js.map