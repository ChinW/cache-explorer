import { ClientMessage } from '../ClientMessage';
export interface SetIsEmptyResponseParams {
    response: boolean;
}
export declare class SetIsEmptyCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): SetIsEmptyResponseParams;
}
