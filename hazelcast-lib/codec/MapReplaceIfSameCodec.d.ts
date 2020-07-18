/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
export interface MapReplaceIfSameResponseParams {
    response: boolean;
}
export declare class MapReplaceIfSameCodec {
    static encodeRequest(name: string, key: Data, testValue: Data, value: Data, threadId: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapReplaceIfSameResponseParams;
}
