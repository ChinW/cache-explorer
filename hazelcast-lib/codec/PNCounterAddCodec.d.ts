/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { UUID } from '../core/UUID';
export interface PNCounterAddResponseParams {
    value: Long;
    replicaTimestamps: Array<[UUID, Long]>;
    replicaCount: number;
}
export declare class PNCounterAddCodec {
    static encodeRequest(name: string, delta: Long, getBeforeUpdate: boolean, replicaTimestamps: Array<[UUID, Long]>, targetReplicaUUID: UUID): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): PNCounterAddResponseParams;
}
