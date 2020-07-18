import { ClientMessage } from '../../ClientMessage';
import { StackTraceElement } from '../../protocol/StackTraceElement';
export declare class StackTraceElementCodec {
    static encode(clientMessage: ClientMessage, stackTraceElement: StackTraceElement): void;
    static decode(clientMessage: ClientMessage): StackTraceElement;
}
