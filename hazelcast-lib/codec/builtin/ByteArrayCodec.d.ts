/// <reference types="node" />
import { ClientMessage } from '../../ClientMessage';
export declare class ByteArrayCodec {
    static encode(clientMessage: ClientMessage, bytes: Buffer): void;
    static decode(clientMessage: ClientMessage): Buffer;
}
