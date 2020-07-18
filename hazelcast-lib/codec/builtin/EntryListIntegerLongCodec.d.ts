/// <reference types="long" />
import { ClientMessage } from '../../ClientMessage';
import * as Long from 'long';
export declare class EntryListIntegerLongCodec {
    static encode(clientMessage: ClientMessage, entries: Array<[number, Long]>): void;
    static decode(clientMessage: ClientMessage): Array<[number, Long]>;
}
