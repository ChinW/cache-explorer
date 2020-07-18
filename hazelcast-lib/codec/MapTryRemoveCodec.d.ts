/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface MapTryRemoveResponseParams {
    response: boolean;
}
export declare class MapTryRemoveCodec {
    static encodeRequest(name: string, key: Data, threadId: Long, timeout: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapTryRemoveResponseParams;
}
