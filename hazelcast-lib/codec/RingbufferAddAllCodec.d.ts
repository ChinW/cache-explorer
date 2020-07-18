/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
import * as Long from 'long';
export interface RingbufferAddAllResponseParams {
    response: Long;
}
export declare class RingbufferAddAllCodec {
    static encodeRequest(name: string, valueList: Data[], overflowPolicy: number): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): RingbufferAddAllResponseParams;
}
