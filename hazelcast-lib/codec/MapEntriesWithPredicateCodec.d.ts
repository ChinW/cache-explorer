import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MapEntriesWithPredicateResponseParams {
    response: Array<[Data, Data]>;
}
export declare class MapEntriesWithPredicateCodec {
    static encodeRequest(name: string, predicate: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapEntriesWithPredicateResponseParams;
}
