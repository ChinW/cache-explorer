import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ReplicatedMapGetResponseParams {
    response: Data;
}
export declare class ReplicatedMapGetCodec {
    static encodeRequest(name: string, key: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ReplicatedMapGetResponseParams;
}
