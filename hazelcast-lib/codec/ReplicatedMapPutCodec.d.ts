/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface ReplicatedMapPutResponseParams {
    response: Data;
}
export declare class ReplicatedMapPutCodec {
    static encodeRequest(name: string, key: Data, value: Data, ttl: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ReplicatedMapPutResponseParams;
}
