import { ClientMessage } from '../ClientMessage';
export interface ReplicatedMapIsEmptyResponseParams {
    response: boolean;
}
export declare class ReplicatedMapIsEmptyCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ReplicatedMapIsEmptyResponseParams;
}
