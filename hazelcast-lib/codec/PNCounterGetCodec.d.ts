/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
import * as Long from 'long';
export interface PNCounterGetResponseParams {
    value: Long;
    replicaTimestamps: Array<[UUID, Long]>;
    replicaCount: number;
}
export declare class PNCounterGetCodec {
    static encodeRequest(name: string, replicaTimestamps: Array<[UUID, Long]>, targetReplicaUUID: UUID): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): PNCounterGetResponseParams;
}
