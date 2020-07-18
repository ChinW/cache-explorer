import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MapKeySetResponseParams {
    response: Data[];
}
export declare class MapKeySetCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapKeySetResponseParams;
}
