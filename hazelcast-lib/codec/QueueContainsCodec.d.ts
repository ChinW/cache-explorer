import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface QueueContainsResponseParams {
    response: boolean;
}
export declare class QueueContainsCodec {
    static encodeRequest(name: string, value: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueContainsResponseParams;
}
