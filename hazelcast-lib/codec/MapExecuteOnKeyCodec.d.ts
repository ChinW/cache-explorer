/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface MapExecuteOnKeyResponseParams {
    response: Data;
}
export declare class MapExecuteOnKeyCodec {
    static encodeRequest(name: string, entryProcessor: Data, key: Data, threadId: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapExecuteOnKeyResponseParams;
}
