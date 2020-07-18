/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface RingbufferReadOneResponseParams {
    response: Data;
}
export declare class RingbufferReadOneCodec {
    static encodeRequest(name: string, sequence: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): RingbufferReadOneResponseParams;
}
