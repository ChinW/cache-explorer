import { ClientMessage } from '../../ClientMessage';
export declare class StringCodec {
    static encode(clientMessage: ClientMessage, value: string): void;
    static decode(clientMessage: ClientMessage): string;
}
