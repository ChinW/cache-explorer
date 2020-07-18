/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface MultiMapRemoveResponseParams {
    response: Data[];
}
export declare class MultiMapRemoveCodec {
    static encodeRequest(name: string, key: Data, threadId: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MultiMapRemoveResponseParams;
}
