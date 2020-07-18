import { ClientMessage } from '../../ClientMessage';
export declare class EntryListCodec {
    static encode<K, V>(clientMessage: ClientMessage, entries: Array<[K, V]>, keyEncoder: (msg: ClientMessage, key: K) => void, valueEncoder: (msg: ClientMessage, value: V) => void): void;
    static encodeNullable<K, V>(clientMessage: ClientMessage, entries: Array<[K, V]>, keyEncoder: (msg: ClientMessage, key: K) => void, valueEncoder: (msg: ClientMessage, value: V) => void): void;
    static decode<K, V>(clientMessage: ClientMessage, keyDecoder: (msg: ClientMessage) => K, valueDecoder: (msg: ClientMessage) => V): Array<[K, V]>;
    static decodeNullable<K, V>(clientMessage: ClientMessage, keyDecoder: (msg: ClientMessage) => K, valueDecoder: (msg: ClientMessage) => V): Array<[K, V]>;
}
