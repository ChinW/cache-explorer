/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
import * as Long from 'long';
export interface RingbufferAddResponseParams {
    response: Long;
}
export declare class RingbufferAddCodec {
    static encodeRequest(name: string, overflowPolicy: number, value: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): RingbufferAddResponseParams;
}
