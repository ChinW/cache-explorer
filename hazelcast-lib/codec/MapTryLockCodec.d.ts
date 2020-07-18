/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface MapTryLockResponseParams {
    response: boolean;
}
export declare class MapTryLockCodec {
    static encodeRequest(name: string, key: Data, threadId: Long, lease: Long, timeout: Long, referenceId: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapTryLockResponseParams;
}
