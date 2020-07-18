import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ReplicatedMapContainsKeyResponseParams {
    response: boolean;
}
export declare class ReplicatedMapContainsKeyCodec {
    static encodeRequest(name: string, key: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ReplicatedMapContainsKeyResponseParams;
}
