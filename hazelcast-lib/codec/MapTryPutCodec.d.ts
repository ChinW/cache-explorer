/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface MapTryPutResponseParams {
    response: boolean;
}
export declare class MapTryPutCodec {
    static encodeRequest(name: string, key: Data, value: Data, threadId: Long, timeout: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapTryPutResponseParams;
}
