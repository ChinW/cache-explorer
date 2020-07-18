import { ClientMessage } from '../ClientMessage';
export interface MapIsEmptyResponseParams {
    response: boolean;
}
export declare class MapIsEmptyCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapIsEmptyResponseParams;
}
