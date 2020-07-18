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
var HazelcastError = /** @class */ (function (_super) {
    __extends(HazelcastError, _super);
    function HazelcastError(msg, cause) {
        var _this = _super.call(this, msg) || this;
        _this.cause = cause;
        Error.captureStackTrace(_this, HazelcastError);
        Object.setPrototypeOf(_this, HazelcastError.prototype);
        return _this;
    }
    return HazelcastError;
}(Error));
exports.HazelcastError = HazelcastError;
var HazelcastSerializationError = /** @class */ (function (_super) {
    __extends(HazelcastSerializationError, _super);
    function HazelcastSerializationError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, HazelcastSerializationError.prototype);
        return _this;
    }
    return HazelcastSerializationError;
}(HazelcastError));
exports.HazelcastSerializationError = HazelcastSerializationError;
var AuthenticationError = /** @class */ (function (_super) {
    __extends(AuthenticationError, _super);
    function AuthenticationError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, AuthenticationError.prototype);
        return _this;
    }
    return AuthenticationError;
}(HazelcastError));
exports.AuthenticationError = AuthenticationError;
var ClientNotActiveError = /** @class */ (function (_super) {
    __extends(ClientNotActiveError, _super);
    function ClientNotActiveError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, ClientNotActiveError.prototype);
        return _this;
    }
    return ClientNotActiveError;
}(HazelcastError));
exports.ClientNotActiveError = ClientNotActiveError;
var ClientNotAllowedInClusterError = /** @class */ (function (_super) {
    __extends(ClientNotAllowedInClusterError, _super);
    function ClientNotAllowedInClusterError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, ClientNotAllowedInClusterError.prototype);
        return _this;
    }
    return ClientNotAllowedInClusterError;
}(HazelcastError));
exports.ClientNotAllowedInClusterError = ClientNotAllowedInClusterError;
var ClientOfflineError = /** @class */ (function (_super) {
    __extends(ClientOfflineError, _super);
    function ClientOfflineError(cause) {
        var _this = _super.call(this, 'No connection found to cluster', cause) || this;
        Object.setPrototypeOf(_this, ClientOfflineError.prototype);
        return _this;
    }
    return ClientOfflineError;
}(HazelcastError));
exports.ClientOfflineError = ClientOfflineError;
var InvalidConfigurationError = /** @class */ (function (_super) {
    __extends(InvalidConfigurationError, _super);
    function InvalidConfigurationError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, InvalidConfigurationError.prototype);
        return _this;
    }
    return InvalidConfigurationError;
}(HazelcastError));
exports.InvalidConfigurationError = InvalidConfigurationError;
var IllegalStateError = /** @class */ (function (_super) {
    __extends(IllegalStateError, _super);
    function IllegalStateError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, IllegalStateError.prototype);
        return _this;
    }
    return IllegalStateError;
}(HazelcastError));
exports.IllegalStateError = IllegalStateError;
var StaleSequenceError = /** @class */ (function (_super) {
    __extends(StaleSequenceError, _super);
    function StaleSequenceError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, StaleSequenceError.prototype);
        return _this;
    }
    return StaleSequenceError;
}(HazelcastError));
exports.StaleSequenceError = StaleSequenceError;
var TopicOverloadError = /** @class */ (function (_super) {
    __extends(TopicOverloadError, _super);
    function TopicOverloadError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, TopicOverloadError.prototype);
        return _this;
    }
    return TopicOverloadError;
}(HazelcastError));
exports.TopicOverloadError = TopicOverloadError;
var IOError = /** @class */ (function (_super) {
    __extends(IOError, _super);
    function IOError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, IOError.prototype);
        return _this;
    }
    return IOError;
}(HazelcastError));
exports.IOError = IOError;
var UndefinedErrorCodeError = /** @class */ (function (_super) {
    __extends(UndefinedErrorCodeError, _super);
    function UndefinedErrorCodeError(msg, className) {
        var _this = _super.call(this, 'Class name: ' + className + ' , Message: ' + msg) || this;
        Object.setPrototypeOf(_this, UndefinedErrorCodeError.prototype);
        return _this;
    }
    return UndefinedErrorCodeError;
}(HazelcastError));
exports.UndefinedErrorCodeError = UndefinedErrorCodeError;
var InvocationTimeoutError = /** @class */ (function (_super) {
    __extends(InvocationTimeoutError, _super);
    function InvocationTimeoutError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, InvocationTimeoutError.prototype);
        return _this;
    }
    return InvocationTimeoutError;
}(HazelcastError));
exports.InvocationTimeoutError = InvocationTimeoutError;
var RetryableHazelcastError = /** @class */ (function (_super) {
    __extends(RetryableHazelcastError, _super);
    function RetryableHazelcastError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, RetryableHazelcastError.prototype);
        return _this;
    }
    return RetryableHazelcastError;
}(HazelcastError));
exports.RetryableHazelcastError = RetryableHazelcastError;
var TargetNotMemberError = /** @class */ (function (_super) {
    __extends(TargetNotMemberError, _super);
    function TargetNotMemberError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, TargetNotMemberError.prototype);
        return _this;
    }
    return TargetNotMemberError;
}(RetryableHazelcastError));
exports.TargetNotMemberError = TargetNotMemberError;
var CallerNotMemberError = /** @class */ (function (_super) {
    __extends(CallerNotMemberError, _super);
    function CallerNotMemberError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, CallerNotMemberError.prototype);
        return _this;
    }
    return CallerNotMemberError;
}(RetryableHazelcastError));
exports.CallerNotMemberError = CallerNotMemberError;
var CancellationError = /** @class */ (function (_super) {
    __extends(CancellationError, _super);
    function CancellationError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, CancellationError.prototype);
        return _this;
    }
    return CancellationError;
}(IllegalStateError));
exports.CancellationError = CancellationError;
var ClassCastError = /** @class */ (function (_super) {
    __extends(ClassCastError, _super);
    function ClassCastError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, ClassCastError.prototype);
        return _this;
    }
    return ClassCastError;
}(HazelcastError));
exports.ClassCastError = ClassCastError;
var ClassNotFoundError = /** @class */ (function (_super) {
    __extends(ClassNotFoundError, _super);
    function ClassNotFoundError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, ClassNotFoundError.prototype);
        return _this;
    }
    return ClassNotFoundError;
}(HazelcastError));
exports.ClassNotFoundError = ClassNotFoundError;
var ConcurrentModificationError = /** @class */ (function (_super) {
    __extends(ConcurrentModificationError, _super);
    function ConcurrentModificationError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, ConcurrentModificationError.prototype);
        return _this;
    }
    return ConcurrentModificationError;
}(HazelcastError));
exports.ConcurrentModificationError = ConcurrentModificationError;
var ConfigMismatchError = /** @class */ (function (_super) {
    __extends(ConfigMismatchError, _super);
    function ConfigMismatchError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, ConfigMismatchError.prototype);
        return _this;
    }
    return ConfigMismatchError;
}(HazelcastError));
exports.ConfigMismatchError = ConfigMismatchError;
var DistributedObjectDestroyedError = /** @class */ (function (_super) {
    __extends(DistributedObjectDestroyedError, _super);
    function DistributedObjectDestroyedError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, DistributedObjectDestroyedError.prototype);
        return _this;
    }
    return DistributedObjectDestroyedError;
}(HazelcastError));
exports.DistributedObjectDestroyedError = DistributedObjectDestroyedError;
var HazelcastInstanceNotActiveError = /** @class */ (function (_super) {
    __extends(HazelcastInstanceNotActiveError, _super);
    function HazelcastInstanceNotActiveError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, HazelcastInstanceNotActiveError.prototype);
        return _this;
    }
    return HazelcastInstanceNotActiveError;
}(IllegalStateError));
exports.HazelcastInstanceNotActiveError = HazelcastInstanceNotActiveError;
var MemberLeftError = /** @class */ (function (_super) {
    __extends(MemberLeftError, _super);
    function MemberLeftError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, MemberLeftError.prototype);
        return _this;
    }
    return MemberLeftError;
}(RetryableHazelcastError));
exports.MemberLeftError = MemberLeftError;
var PartitionMigratingError = /** @class */ (function (_super) {
    __extends(PartitionMigratingError, _super);
    function PartitionMigratingError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, PartitionMigratingError.prototype);
        return _this;
    }
    return PartitionMigratingError;
}(RetryableHazelcastError));
exports.PartitionMigratingError = PartitionMigratingError;
var QueryError = /** @class */ (function (_super) {
    __extends(QueryError, _super);
    function QueryError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, QueryError.prototype);
        return _this;
    }
    return QueryError;
}(HazelcastError));
exports.QueryError = QueryError;
var TransactionError = /** @class */ (function (_super) {
    __extends(TransactionError, _super);
    function TransactionError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, TransactionError.prototype);
        return _this;
    }
    return TransactionError;
}(HazelcastError));
exports.TransactionError = TransactionError;
var TransactionNotActiveError = /** @class */ (function (_super) {
    __extends(TransactionNotActiveError, _super);
    function TransactionNotActiveError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, TransactionNotActiveError.prototype);
        return _this;
    }
    return TransactionNotActiveError;
}(HazelcastError));
exports.TransactionNotActiveError = TransactionNotActiveError;
var TransactionTimedOutError = /** @class */ (function (_super) {
    __extends(TransactionTimedOutError, _super);
    function TransactionTimedOutError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, TransactionTimedOutError.prototype);
        return _this;
    }
    return TransactionTimedOutError;
}(HazelcastError));
exports.TransactionTimedOutError = TransactionTimedOutError;
var SplitBrainProtectionError = /** @class */ (function (_super) {
    __extends(SplitBrainProtectionError, _super);
    function SplitBrainProtectionError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, SplitBrainProtectionError.prototype);
        return _this;
    }
    return SplitBrainProtectionError;
}(TransactionError));
exports.SplitBrainProtectionError = SplitBrainProtectionError;
var RetryableIOError = /** @class */ (function (_super) {
    __extends(RetryableIOError, _super);
    function RetryableIOError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, RetryableIOError.prototype);
        return _this;
    }
    return RetryableIOError;
}(RetryableHazelcastError));
exports.RetryableIOError = RetryableIOError;
var TargetDisconnectedError = /** @class */ (function (_super) {
    __extends(TargetDisconnectedError, _super);
    function TargetDisconnectedError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, TargetDisconnectedError.prototype);
        return _this;
    }
    return TargetDisconnectedError;
}(HazelcastError));
exports.TargetDisconnectedError = TargetDisconnectedError;
var UnsupportedOperationError = /** @class */ (function (_super) {
    __extends(UnsupportedOperationError, _super);
    function UnsupportedOperationError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, UnsupportedOperationError.prototype);
        return _this;
    }
    return UnsupportedOperationError;
}(HazelcastError));
exports.UnsupportedOperationError = UnsupportedOperationError;
var ConsistencyLostError = /** @class */ (function (_super) {
    __extends(ConsistencyLostError, _super);
    function ConsistencyLostError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, ConsistencyLostError.prototype);
        return _this;
    }
    return ConsistencyLostError;
}(HazelcastError));
exports.ConsistencyLostError = ConsistencyLostError;
var NoDataMemberInClusterError = /** @class */ (function (_super) {
    __extends(NoDataMemberInClusterError, _super);
    function NoDataMemberInClusterError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, NoDataMemberInClusterError.prototype);
        return _this;
    }
    return NoDataMemberInClusterError;
}(HazelcastError));
exports.NoDataMemberInClusterError = NoDataMemberInClusterError;
var StaleTaskIdError = /** @class */ (function (_super) {
    __extends(StaleTaskIdError, _super);
    function StaleTaskIdError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, StaleTaskIdError.prototype);
        return _this;
    }
    return StaleTaskIdError;
}(HazelcastError));
exports.StaleTaskIdError = StaleTaskIdError;
var NodeIdOutOfRangeError = /** @class */ (function (_super) {
    __extends(NodeIdOutOfRangeError, _super);
    function NodeIdOutOfRangeError(msg, cause) {
        var _this = _super.call(this, msg, cause) || this;
        Object.setPrototypeOf(_this, NodeIdOutOfRangeError.prototype);
        return _this;
    }
    return NodeIdOutOfRangeError;
}(HazelcastError));
exports.NodeIdOutOfRangeError = NodeIdOutOfRangeError;
//# sourceMappingURL=HazelcastError.js.map