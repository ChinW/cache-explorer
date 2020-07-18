import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MapValuesWithPredicateResponseParams {
    response: Data[];
}
export declare class MapValuesWithPredicateCodec {
    static encodeRequest(name: string, predicate: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapValuesWithPredicateResponseParams;
}
