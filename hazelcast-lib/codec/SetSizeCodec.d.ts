import { ClientMessage } from '../ClientMessage';
export interface SetSizeResponseParams {
    response: number;
}
export declare class SetSizeCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): SetSizeResponseParams;
}
