import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ReplicatedMapValuesResponseParams {
    response: Data[];
}
export declare class ReplicatedMapValuesCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ReplicatedMapValuesResponseParams;
}
