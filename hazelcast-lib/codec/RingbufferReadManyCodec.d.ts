/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface RingbufferReadManyResponseParams {
    readCount: number;
    items: Data[];
    itemSeqs: Long[];
    nextSeq: Long;
}
export declare class RingbufferReadManyCodec {
    static encodeRequest(name: string, startSequence: Long, minCount: number, maxCount: number, filter: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): RingbufferReadManyResponseParams;
}
