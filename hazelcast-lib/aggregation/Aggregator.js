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
var Long = require("long");
var AggregatorFactory_1 = require("./AggregatorFactory");
var AbstractAggregator = /** @class */ (function () {
    function AbstractAggregator(attributePath) {
        this.attributePath = attributePath;
    }
    AbstractAggregator.prototype.getFactoryId = function () {
        return AggregatorFactory_1.AggregatorFactory.FACTORY_ID;
    };
    return AbstractAggregator;
}());
exports.AbstractAggregator = AbstractAggregator;
var CountAggregator = /** @class */ (function (_super) {
    __extends(CountAggregator, _super);
    function CountAggregator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CountAggregator.prototype.readData = function (input) {
        this.attributePath = input.readUTF();
        // member side field, not used in client
        input.readLong();
    };
    CountAggregator.prototype.writeData = function (output) {
        output.writeUTF(this.attributePath);
        // member side field, not used in client
        output.writeLong(Long.ZERO);
    };
    CountAggregator.prototype.getClassId = function () {
        return AggregatorFactory_1.AggregatorFactory.COUNT;
    };
    return CountAggregator;
}(AbstractAggregator));
exports.CountAggregator = CountAggregator;
var DoubleAverageAggregator = /** @class */ (function (_super) {
    __extends(DoubleAverageAggregator, _super);
    function DoubleAverageAggregator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DoubleAverageAggregator.prototype.getClassId = function () {
        return AggregatorFactory_1.AggregatorFactory.DOUBLE_AVG;
    };
    DoubleAverageAggregator.prototype.readData = function (input) {
        this.attributePath = input.readUTF();
        input.readDouble();
        input.readLong();
    };
    DoubleAverageAggregator.prototype.writeData = function (output) {
        output.writeUTF(this.attributePath);
        output.writeDouble(0);
        output.writeLong(Long.ZERO);
    };
    return DoubleAverageAggregator;
}(AbstractAggregator));
exports.DoubleAverageAggregator = DoubleAverageAggregator;
var DoubleSumAggregator = /** @class */ (function (_super) {
    __extends(DoubleSumAggregator, _super);
    function DoubleSumAggregator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DoubleSumAggregator.prototype.getClassId = function () {
        return AggregatorFactory_1.AggregatorFactory.DOUBLE_SUM;
    };
    DoubleSumAggregator.prototype.readData = function (input) {
        this.attributePath = input.readUTF();
        input.readDouble();
    };
    DoubleSumAggregator.prototype.writeData = function (output) {
        output.writeUTF(this.attributePath);
        output.writeDouble(0);
    };
    return DoubleSumAggregator;
}(AbstractAggregator));
exports.DoubleSumAggregator = DoubleSumAggregator;
var NumberAverageAggregator = /** @class */ (function (_super) {
    __extends(NumberAverageAggregator, _super);
    function NumberAverageAggregator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberAverageAggregator.prototype.getClassId = function () {
        return AggregatorFactory_1.AggregatorFactory.NUMBER_AVG;
    };
    NumberAverageAggregator.prototype.readData = function (input) {
        this.attributePath = input.readUTF();
        input.readDouble();
        input.readLong();
    };
    NumberAverageAggregator.prototype.writeData = function (output) {
        output.writeUTF(this.attributePath);
        output.writeDouble(0);
        output.writeLong(Long.ZERO);
    };
    return NumberAverageAggregator;
}(AbstractAggregator));
exports.NumberAverageAggregator = NumberAverageAggregator;
var FixedPointSumAggregator = /** @class */ (function (_super) {
    __extends(FixedPointSumAggregator, _super);
    function FixedPointSumAggregator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FixedPointSumAggregator.prototype.getClassId = function () {
        return AggregatorFactory_1.AggregatorFactory.FIXED_SUM;
    };
    FixedPointSumAggregator.prototype.readData = function (input) {
        this.attributePath = input.readUTF();
        input.readLong();
    };
    FixedPointSumAggregator.prototype.writeData = function (output) {
        output.writeUTF(this.attributePath);
        output.writeLong(Long.ZERO);
    };
    return FixedPointSumAggregator;
}(AbstractAggregator));
exports.FixedPointSumAggregator = FixedPointSumAggregator;
var FloatingPointSumAggregator = /** @class */ (function (_super) {
    __extends(FloatingPointSumAggregator, _super);
    function FloatingPointSumAggregator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FloatingPointSumAggregator.prototype.getClassId = function () {
        return AggregatorFactory_1.AggregatorFactory.FLOATING_POINT_SUM;
    };
    FloatingPointSumAggregator.prototype.readData = function (input) {
        this.attributePath = input.readUTF();
        input.readDouble();
    };
    FloatingPointSumAggregator.prototype.writeData = function (output) {
        output.writeUTF(this.attributePath);
        output.writeDouble(0);
    };
    return FloatingPointSumAggregator;
}(AbstractAggregator));
exports.FloatingPointSumAggregator = FloatingPointSumAggregator;
var MaxAggregator = /** @class */ (function (_super) {
    __extends(MaxAggregator, _super);
    function MaxAggregator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MaxAggregator.prototype.getClassId = function () {
        return AggregatorFactory_1.AggregatorFactory.MAX;
    };
    MaxAggregator.prototype.readData = function (input) {
        this.attributePath = input.readUTF();
        input.readObject();
    };
    MaxAggregator.prototype.writeData = function (output) {
        output.writeUTF(this.attributePath);
        output.writeObject(null);
    };
    return MaxAggregator;
}(AbstractAggregator));
exports.MaxAggregator = MaxAggregator;
var MinAggregator = /** @class */ (function (_super) {
    __extends(MinAggregator, _super);
    function MinAggregator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MinAggregator.prototype.getClassId = function () {
        return AggregatorFactory_1.AggregatorFactory.MIN;
    };
    MinAggregator.prototype.readData = function (input) {
        this.attributePath = input.readUTF();
        input.readObject();
    };
    MinAggregator.prototype.writeData = function (output) {
        output.writeUTF(this.attributePath);
        output.writeObject(null);
    };
    return MinAggregator;
}(AbstractAggregator));
exports.MinAggregator = MinAggregator;
var IntegerAverageAggregator = /** @class */ (function (_super) {
    __extends(IntegerAverageAggregator, _super);
    function IntegerAverageAggregator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntegerAverageAggregator.prototype.getClassId = function () {
        return AggregatorFactory_1.AggregatorFactory.INT_AVG;
    };
    IntegerAverageAggregator.prototype.readData = function (input) {
        this.attributePath = input.readUTF();
        input.readLong();
        input.readLong();
    };
    IntegerAverageAggregator.prototype.writeData = function (output) {
        output.writeUTF(this.attributePath);
        output.writeLong(Long.ZERO);
        output.writeLong(Long.ZERO);
    };
    return IntegerAverageAggregator;
}(AbstractAggregator));
exports.IntegerAverageAggregator = IntegerAverageAggregator;
var IntegerSumAggregator = /** @class */ (function (_super) {
    __extends(IntegerSumAggregator, _super);
    function IntegerSumAggregator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntegerSumAggregator.prototype.getClassId = function () {
        return AggregatorFactory_1.AggregatorFactory.INT_SUM;
    };
    IntegerSumAggregator.prototype.readData = function (input) {
        this.attributePath = input.readUTF();
        input.readLong();
    };
    IntegerSumAggregator.prototype.writeData = function (output) {
        output.writeUTF(this.attributePath);
        output.writeLong(Long.ZERO);
    };
    return IntegerSumAggregator;
}(AbstractAggregator));
exports.IntegerSumAggregator = IntegerSumAggregator;
var LongAverageAggregator = /** @class */ (function (_super) {
    __extends(LongAverageAggregator, _super);
    function LongAverageAggregator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LongAverageAggregator.prototype.getClassId = function () {
        return AggregatorFactory_1.AggregatorFactory.LONG_AVG;
    };
    LongAverageAggregator.prototype.readData = function (input) {
        this.attributePath = input.readUTF();
        input.readLong();
        input.readLong();
    };
    LongAverageAggregator.prototype.writeData = function (output) {
        output.writeUTF(this.attributePath);
        output.writeLong(Long.ZERO);
        output.writeLong(Long.ZERO);
    };
    return LongAverageAggregator;
}(AbstractAggregator));
exports.LongAverageAggregator = LongAverageAggregator;
var LongSumAggregator = /** @class */ (function (_super) {
    __extends(LongSumAggregator, _super);
    function LongSumAggregator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LongSumAggregator.prototype.getClassId = function () {
        return AggregatorFactory_1.AggregatorFactory.LONG_SUM;
    };
    LongSumAggregator.prototype.readData = function (input) {
        this.attributePath = input.readUTF();
        input.readLong();
    };
    LongSumAggregator.prototype.writeData = function (output) {
        output.writeUTF(this.attributePath);
        output.writeLong(Long.ZERO);
    };
    return LongSumAggregator;
}(AbstractAggregator));
exports.LongSumAggregator = LongSumAggregator;
//# sourceMappingURL=Aggregator.js.map