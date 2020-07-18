/// <reference types="long" />
import { ClientMessage } from '../../ClientMessage';
import { UUID } from '../../core/UUID';
import * as Long from 'long';
export declare class EntryListUUIDLongCodec {
    static encode(clientMessage: ClientMessage, entries: Array<[UUID, Long]>): void;
    static decode(clientMessage: ClientMessage): Array<[UUID, Long]>;
}
