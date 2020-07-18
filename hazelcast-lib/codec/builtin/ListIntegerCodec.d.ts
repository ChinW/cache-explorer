import { ClientMessage } from '../../ClientMessage';
export declare class ListIntegerCodec {
    static encode(clientMessage: ClientMessage, list: number[]): void;
    static decode(clientMessage: ClientMessage): number[];
}
