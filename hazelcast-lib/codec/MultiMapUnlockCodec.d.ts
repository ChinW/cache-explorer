/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export declare class MultiMapUnlockCodec {
    static encodeRequest(name: string, key: Data, threadId: Long, referenceId: Long): ClientMessage;
}
