/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface MapAddNearCacheInvalidationListenerResponseParams {
    response: UUID;
}
export declare class MapAddNearCacheInvalidationListenerCodec {
    static encodeRequest(name: string, listenerFlags: number, localOnly: boolean): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapAddNearCacheInvalidationListenerResponseParams;
    static handle(clientMessage: ClientMessage, handleIMapInvalidationEvent?: (key: Data, sourceUuid: UUID, partitionUuid: UUID, sequence: Long) => void, handleIMapBatchInvalidationEvent?: (keys: Data[], sourceUuids: UUID[], partitionUuids: UUID[], sequences: Long[]) => void): void;
}
