/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
export interface RingbufferRemainingCapacityResponseParams {
    response: Long;
}
export declare class RingbufferRemainingCapacityCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): RingbufferRemainingCapacityResponseParams;
}
