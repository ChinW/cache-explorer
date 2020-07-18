import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ReplicatedMapRemoveResponseParams {
    response: Data;
}
export declare class ReplicatedMapRemoveCodec {
    static encodeRequest(name: string, key: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ReplicatedMapRemoveResponseParams;
}
