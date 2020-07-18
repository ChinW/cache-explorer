import { ClientMessage } from '../ClientMessage';
export interface ListIsEmptyResponseParams {
    response: boolean;
}
export declare class ListIsEmptyCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListIsEmptyResponseParams;
}
