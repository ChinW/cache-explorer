import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface QueueIteratorResponseParams {
    response: Data[];
}
export declare class QueueIteratorCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueIteratorResponseParams;
}
