import { ClientMessage } from '../ClientMessage';
export interface QueueIsEmptyResponseParams {
    response: boolean;
}
export declare class QueueIsEmptyCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueIsEmptyResponseParams;
}
