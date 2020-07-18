/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
export interface RingbufferHeadSequenceResponseParams {
    response: Long;
}
export declare class RingbufferHeadSequenceCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): RingbufferHeadSequenceResponseParams;
}
