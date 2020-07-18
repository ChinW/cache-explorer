/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface MultiMapContainsEntryResponseParams {
    response: boolean;
}
export declare class MultiMapContainsEntryCodec {
    static encodeRequest(name: string, key: Data, value: Data, threadId: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MultiMapContainsEntryResponseParams;
}
