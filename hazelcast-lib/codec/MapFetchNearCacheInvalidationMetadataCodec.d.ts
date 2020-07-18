/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
import * as Long from 'long';
export interface MapFetchNearCacheInvalidationMetadataResponseParams {
    namePartitionSequenceList: Array<[string, Array<[number, Long]>]>;
    partitionUuidList: Array<[number, UUID]>;
}
export declare class MapFetchNearCacheInvalidationMetadataCodec {
    static encodeRequest(names: string[], uuid: UUID): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapFetchNearCacheInvalidationMetadataResponseParams;
}
