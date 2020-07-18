/// <reference types="long" />
import { ClientMessage } from '../../ClientMessage';
import * as Long from 'long';
export declare class LongArrayCodec {
    static encode(clientMessage: ClientMessage, array: Long[]): void;
    static decode(clientMessage: ClientMessage): Long[];
}
