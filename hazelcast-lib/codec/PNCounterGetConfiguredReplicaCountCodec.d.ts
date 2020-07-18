import { ClientMessage } from '../ClientMessage';
export interface PNCounterGetConfiguredReplicaCountResponseParams {
    response: number;
}
export declare class PNCounterGetConfiguredReplicaCountCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): PNCounterGetConfiguredReplicaCountResponseParams;
}
