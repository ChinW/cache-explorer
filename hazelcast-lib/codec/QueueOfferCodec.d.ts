/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface QueueOfferResponseParams {
    response: boolean;
}
export declare class QueueOfferCodec {
    static encodeRequest(name: string, value: Data, timeoutMillis: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueOfferResponseParams;
}
