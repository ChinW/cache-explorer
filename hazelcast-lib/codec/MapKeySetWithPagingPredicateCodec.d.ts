import { ClientMessage } from '../ClientMessage';
import { PagingPredicateHolder } from '../protocol/PagingPredicateHolder';
import { Data } from '../serialization/Data';
import { AnchorDataListHolder } from '../protocol/AnchorDataListHolder';
export interface MapKeySetWithPagingPredicateResponseParams {
    response: Data[];
    anchorDataList: AnchorDataListHolder;
}
export declare class MapKeySetWithPagingPredicateCodec {
    static encodeRequest(name: string, predicate: PagingPredicateHolder): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapKeySetWithPagingPredicateResponseParams;
}
