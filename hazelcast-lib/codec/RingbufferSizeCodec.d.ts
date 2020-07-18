/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
export interface RingbufferSizeResponseParams {
    response: Long;
}
export declare class RingbufferSizeCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): RingbufferSizeResponseParams;
}
