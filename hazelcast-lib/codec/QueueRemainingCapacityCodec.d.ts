import { ClientMessage } from '../ClientMessage';
export interface QueueRemainingCapacityResponseParams {
    response: number;
}
export declare class QueueRemainingCapacityCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueRemainingCapacityResponseParams;
}
