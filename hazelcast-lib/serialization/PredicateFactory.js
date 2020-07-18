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
exports.PREDICATE_FACTORY_ID = -20;
var AbstractPredicate = /** @class */ (function () {
    function AbstractPredicate() {
    }
    AbstractPredicate.prototype.getFactoryId = function () {
        return exports.PREDICATE_FACTORY_ID;
    };
    return AbstractPredicate;
}());
exports.AbstractPredicate = AbstractPredicate;
var PredicateFactory = /** @class */ (function () {
    function PredicateFactory(allPredicates) {
        this.idToConstructorMap = {};
        for (var pred in allPredicates) {
            // TODO accessing getClassId from prototype of uninitialized member function is not elegant.
            this.idToConstructorMap[allPredicates[pred].prototype.getClassId()] = allPredicates[pred];
        }
    }
    PredicateFactory.prototype.create = function (type) {
        if (this.idToConstructorMap[type]) {
            return (new this.idToConstructorMap[type]());
        }
        else {
            throw new RangeError("There is no default predicate with id " + type + ".");
        }
    };
    return PredicateFactory;
}());
exports.PredicateFactory = PredicateFactory;
//# sourceMappingURL=PredicateFactory.js.map