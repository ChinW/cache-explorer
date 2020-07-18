import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface QueuePeekResponseParams {
    response: Data;
}
export declare class QueuePeekCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueuePeekResponseParams;
}
