/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface MapEvictResponseParams {
    response: boolean;
}
export declare class MapEvictCodec {
    static encodeRequest(name: string, key: Data, threadId: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapEvictResponseParams;
}
