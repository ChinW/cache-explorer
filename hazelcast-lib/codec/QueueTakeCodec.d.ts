import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface QueueTakeResponseParams {
    response: Data;
}
export declare class QueueTakeCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueTakeResponseParams;
}
