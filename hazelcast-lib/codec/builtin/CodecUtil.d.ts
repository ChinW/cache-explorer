import { ClientMessage } from '../../ClientMessage';
export declare class CodecUtil {
    static fastForwardToEndFrame(clientMessage: ClientMessage): void;
    static encodeNullable<T>(clientMessage: ClientMessage, value: T, encoder: (msg: ClientMessage, val: T) => void): void;
    static decodeNullable<T>(clientMessage: ClientMessage, decoder: (msg: ClientMessage) => T): T;
    static nextFrameIsDataStructureEndFrame(clientMessage: ClientMessage): boolean;
    /**
     * Returns whether the next frame is {@link NULL_FRAME} or not.
     * If it is a {@link NULL_FRAME}, this method consumes the iterator
     * by calling {@link ClientMessage#nextFrame} once to skip the {@link NULL_FRAME}.
     */
    static nextFrameIsNullFrame(clientMessage: ClientMessage): boolean;
}
