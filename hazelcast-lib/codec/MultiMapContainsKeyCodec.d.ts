/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface MultiMapContainsKeyResponseParams {
    response: boolean;
}
export declare class MultiMapContainsKeyCodec {
    static encodeRequest(name: string, key: Data, threadId: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MultiMapContainsKeyResponseParams;
}
