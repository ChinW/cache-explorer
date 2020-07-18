import { ClientMessage } from '../ClientMessage';
export interface QueueSizeResponseParams {
    response: number;
}
export declare class QueueSizeCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueSizeResponseParams;
}
