import { ClientMessage } from '../../ClientMessage';
import { UUID } from '../../core/UUID';
export declare class EntryListIntegerUUIDCodec {
    static encode(clientMessage: ClientMessage, entries: Array<[number, UUID]>): void;
    static decode(clientMessage: ClientMessage): Array<[number, UUID]>;
}
