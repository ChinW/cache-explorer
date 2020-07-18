/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface MultiMapPutResponseParams {
    response: boolean;
}
export declare class MultiMapPutCodec {
    static encodeRequest(name: string, key: Data, value: Data, threadId: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MultiMapPutResponseParams;
}
