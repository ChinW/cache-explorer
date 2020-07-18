/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
export interface RingbufferCapacityResponseParams {
    response: Long;
}
export declare class RingbufferCapacityCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): RingbufferCapacityResponseParams;
}
