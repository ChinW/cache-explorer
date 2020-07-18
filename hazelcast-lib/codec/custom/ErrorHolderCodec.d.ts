import { ClientMessage } from '../../ClientMessage';
import { ErrorHolder } from '../../protocol/ErrorHolder';
export declare class ErrorHolderCodec {
    static encode(clientMessage: ClientMessage, errorHolder: ErrorHolder): void;
    static decode(clientMessage: ClientMessage): ErrorHolder;
}
