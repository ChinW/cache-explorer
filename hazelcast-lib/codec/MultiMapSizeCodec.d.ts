import { ClientMessage } from '../ClientMessage';
export interface MultiMapSizeResponseParams {
    response: number;
}
export declare class MultiMapSizeCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MultiMapSizeResponseParams;
}
