import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ReplicatedMapEntrySetResponseParams {
    response: Array<[Data, Data]>;
}
export declare class ReplicatedMapEntrySetCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ReplicatedMapEntrySetResponseParams;
}
