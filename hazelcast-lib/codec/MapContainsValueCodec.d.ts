import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MapContainsValueResponseParams {
    response: boolean;
}
export declare class MapContainsValueCodec {
    static encodeRequest(name: string, value: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapContainsValueResponseParams;
}
