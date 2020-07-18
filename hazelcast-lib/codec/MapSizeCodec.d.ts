import { ClientMessage } from '../ClientMessage';
export interface MapSizeResponseParams {
    response: number;
}
export declare class MapSizeCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapSizeResponseParams;
}
