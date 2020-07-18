import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MapAggregateWithPredicateResponseParams {
    response: Data;
}
export declare class MapAggregateWithPredicateCodec {
    static encodeRequest(name: string, aggregator: Data, predicate: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapAggregateWithPredicateResponseParams;
}
