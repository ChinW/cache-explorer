import { ClientMessage } from '../../ClientMessage';
export declare class MapCodec {
    static encode<K, V>(clientMessage: ClientMessage, map: Map<K, V>, keyEncoder: (msg: ClientMessage, key: K) => void, valueEncoder: (msg: ClientMessage, value: V) => void): void;
    static encodeNullable<K, V>(clientMessage: ClientMessage, map: Map<K, V>, keyEncoder: (msg: ClientMessage, key: K) => void, valueEncoder: (msg: ClientMessage, value: V) => void): void;
    static decode<K, V>(clientMessage: ClientMessage, keyDecoder: (msg: ClientMessage) => K, valueDecoder: (msg: ClientMessage) => V): Map<K, V>;
    static decodeNullable<K, V>(clientMessage: ClientMessage, keyDecoder: (msg: ClientMessage) => K, valueDecoder: (msg: ClientMessage) => V): Map<K, V>;
}
