import { AnchorDataListHolder } from './AnchorDataListHolder';
import { Data } from '../serialization/Data';
import { SerializationService } from '../serialization/SerializationService';
import { PagingPredicate } from '../serialization/DefaultPredicates';
export declare class PagingPredicateHolder {
    anchorDataListHolder: AnchorDataListHolder;
    predicateData: Data;
    comparatorData: Data;
    pageSize: number;
    page: number;
    iterationTypeId: number;
    partitionKeyData: Data;
    constructor(anchorDataListHolder: AnchorDataListHolder, predicateData: Data, comparatorData: Data, pageSize: number, page: number, iterationTypeId: number, partitionKeyData: Data);
    static of(predicate: PagingPredicate, serializationService: SerializationService): PagingPredicateHolder;
    private static buildHolder(serializationService, predicate);
}
