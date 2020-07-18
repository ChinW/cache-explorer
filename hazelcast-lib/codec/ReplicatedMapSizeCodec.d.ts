import { ClientMessage } from '../ClientMessage';
export interface ReplicatedMapSizeResponseParams {
    response: number;
}
export declare class ReplicatedMapSizeCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ReplicatedMapSizeResponseParams;
}
