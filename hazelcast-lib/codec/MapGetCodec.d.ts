/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface MapGetResponseParams {
    response: Data;
}
export declare class MapGetCodec {
    static encodeRequest(name: string, key: Data, threadId: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapGetResponseParams;
}
