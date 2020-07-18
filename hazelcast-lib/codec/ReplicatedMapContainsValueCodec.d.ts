import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ReplicatedMapContainsValueResponseParams {
    response: boolean;
}
export declare class ReplicatedMapContainsValueCodec {
    static encodeRequest(name: string, value: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ReplicatedMapContainsValueResponseParams;
}
