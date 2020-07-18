import { ClientMessage } from '../../ClientMessage';
import { UUID } from '../../core/UUID';
export declare class ListUUIDCodec {
    static encode(clientMessage: ClientMessage, list: UUID[]): void;
    static decode(clientMessage: ClientMessage): UUID[];
}
