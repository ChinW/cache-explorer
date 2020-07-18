/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
import { Data } from '../serialization/Data';
import { SimpleEntryView } from '../core/SimpleEntryView';
export interface MapGetEntryViewResponseParams {
    response: SimpleEntryView<Data, Data>;
    maxIdle: Long;
}
export declare class MapGetEntryViewCodec {
    static encodeRequest(name: string, key: Data, threadId: Long): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapGetEntryViewResponseParams;
}
