/// <reference types="long" />
import { ClientMessage } from '../../ClientMessage';
import * as Long from 'long';
export declare class ListLongCodec {
    static encode(clientMessage: ClientMessage, list: Long[]): void;
    static decode(clientMessage: ClientMessage): Long[];
}
