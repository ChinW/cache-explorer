import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export declare class QueuePutCodec {
    static encodeRequest(name: string, value: Data): ClientMessage;
}
