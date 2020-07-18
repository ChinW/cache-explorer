import { ClientMessage } from '../ClientMessage';
export interface ListSizeResponseParams {
    response: number;
}
export declare class ListSizeCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListSizeResponseParams;
}
