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
var AnchorDataListHolder_1 = require("./AnchorDataListHolder");
var PagingPredicateHolder = /** @class */ (function () {
    function PagingPredicateHolder(anchorDataListHolder, predicateData, comparatorData, pageSize, page, iterationTypeId, partitionKeyData) {
        this.anchorDataListHolder = anchorDataListHolder;
        this.predicateData = predicateData;
        this.comparatorData = comparatorData;
        this.pageSize = pageSize;
        this.page = page;
        this.iterationTypeId = iterationTypeId;
        this.partitionKeyData = partitionKeyData;
    }
    PagingPredicateHolder.of = function (predicate, serializationService) {
        if (predicate == null) {
            return null;
        }
        return this.buildHolder(serializationService, predicate);
    };
    PagingPredicateHolder.buildHolder = function (serializationService, predicate) {
        var anchorList = predicate.getAnchorList();
        var anchorDataList = new Array(anchorList.length);
        var pageList = new Array(anchorList.length);
        for (var i = 0; i < anchorList.length; i++) {
            var item = anchorList[i];
            pageList[i] = item[0];
            var anchorEntry = item[1];
            anchorDataList[i] = [serializationService.toData(anchorEntry[0]), serializationService.toData(anchorEntry[1])];
        }
        var anchorDataListHolder = new AnchorDataListHolder_1.AnchorDataListHolder(pageList, anchorDataList);
        var predicateData = serializationService.toData(predicate.getPredicate());
        var comparatorData = serializationService.toData(predicate.getComparator());
        return new PagingPredicateHolder(anchorDataListHolder, predicateData, comparatorData, predicate.getPageSize(), predicate.getPage(), predicate.getIterationType().valueOf(), null);
    };
    return PagingPredicateHolder;
}());
exports.PagingPredicateHolder = PagingPredicateHolder;
//# sourceMappingURL=PagingPredicateHolder.js.map