/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export declare class MapPutTransientCodec {
    static encodeRequest(name: string, key: Data, value: Data, threadId: Long, ttl: Long): ClientMessage;
}
