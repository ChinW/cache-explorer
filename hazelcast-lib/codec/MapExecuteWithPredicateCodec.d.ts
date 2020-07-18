import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MapExecuteWithPredicateResponseParams {
    response: Array<[Data, Data]>;
}
export declare class MapExecuteWithPredicateCodec {
    static encodeRequest(name: string, entryProcessor: Data, predicate: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapExecuteWithPredicateResponseParams;
}
