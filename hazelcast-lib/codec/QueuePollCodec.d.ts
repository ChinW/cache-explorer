/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface QueuePollResponseParams {
    response: Data;
}
export declare class QueuePollCodec {
    static encodeRequest(name: string, timeoutMillis: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueuePollResponseParams;
}
