import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface QueueDrainToMaxSizeResponseParams {
    response: Data[];
}
export declare class QueueDrainToMaxSizeCodec {
    static encodeRequest(name: string, maxSize: number): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueDrainToMaxSizeResponseParams;
}
