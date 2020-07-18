import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MapAggregateResponseParams {
    response: Data;
}
export declare class MapAggregateCodec {
    static encodeRequest(name: string, aggregator: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapAggregateResponseParams;
}
