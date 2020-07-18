/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface MapPutIfAbsentResponseParams {
    response: Data;
}
export declare class MapPutIfAbsentCodec {
    static encodeRequest(name: string, key: Data, value: Data, threadId: Long, ttl: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapPutIfAbsentResponseParams;
}
