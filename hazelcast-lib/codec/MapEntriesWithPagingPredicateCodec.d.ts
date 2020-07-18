import { ClientMessage } from '../ClientMessage';
import { PagingPredicateHolder } from '../protocol/PagingPredicateHolder';
import { Data } from '../serialization/Data';
import { AnchorDataListHolder } from '../protocol/AnchorDataListHolder';
export interface MapEntriesWithPagingPredicateResponseParams {
    response: Array<[Data, Data]>;
    anchorDataList: AnchorDataListHolder;
}
export declare class MapEntriesWithPagingPredicateCodec {
    static encodeRequest(name: string, predicate: PagingPredicateHolder): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapEntriesWithPagingPredicateResponseParams;
}
