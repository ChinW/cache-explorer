import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MapKeySetWithPredicateResponseParams {
    response: Data[];
}
export declare class MapKeySetWithPredicateCodec {
    static encodeRequest(name: string, predicate: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapKeySetWithPredicateResponseParams;
}
