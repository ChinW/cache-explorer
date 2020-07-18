import { ClientMessage } from '../../ClientMessage';
export declare class ListMultiFrameCodec {
    static encode<T>(clientMessage: ClientMessage, list: T[], encoder: (msg: ClientMessage, value: T) => void): void;
    static encodeContainsNullable<T>(clientMessage: ClientMessage, list: T[], encoder: (msg: ClientMessage, value: T) => void): void;
    static encodeNullable<T>(clientMessage: ClientMessage, list: T[], encoder: (msg: ClientMessage, value: T) => void): void;
    static decode<T>(clientMessage: ClientMessage, decoder: (msg: ClientMessage) => T): T[];
}
