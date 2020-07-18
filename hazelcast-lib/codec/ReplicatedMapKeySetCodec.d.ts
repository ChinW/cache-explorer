import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ReplicatedMapKeySetResponseParams {
    response: Data[];
}
export declare class ReplicatedMapKeySetCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ReplicatedMapKeySetResponseParams;
}
