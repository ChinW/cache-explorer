/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export declare class MultiMapForceUnlockCodec {
    static encodeRequest(name: string, key: Data, referenceId: Long): ClientMessage;
}
