import { ClientMessage } from '../../ClientMessage';
import { ErrorHolder } from '../../protocol/ErrorHolder';
export declare const EXCEPTION_MESSAGE_TYPE = 0;
export declare class ErrorsCodec {
    static decode(clientMessage: ClientMessage): ErrorHolder[];
}
