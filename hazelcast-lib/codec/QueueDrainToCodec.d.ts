import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface QueueDrainToResponseParams {
    response: Data[];
}
export declare class QueueDrainToCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueDrainToResponseParams;
}
