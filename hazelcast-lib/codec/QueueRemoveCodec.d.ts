import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface QueueRemoveResponseParams {
    response: boolean;
}
export declare class QueueRemoveCodec {
    static encodeRequest(name: string, value: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueRemoveResponseParams;
}
