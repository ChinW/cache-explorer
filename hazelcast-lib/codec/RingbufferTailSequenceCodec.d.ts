/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
export interface RingbufferTailSequenceResponseParams {
    response: Long;
}
export declare class RingbufferTailSequenceCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): RingbufferTailSequenceResponseParams;
}
