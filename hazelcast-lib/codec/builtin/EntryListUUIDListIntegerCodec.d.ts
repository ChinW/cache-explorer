import { ClientMessage } from '../../ClientMessage';
import { UUID } from '../../core/UUID';
export declare class EntryListUUIDListIntegerCodec {
    static encode(clientMessage: ClientMessage, entries: Array<[UUID, number[]]>): void;
    static decode(clientMessage: ClientMessage): Array<[UUID, number[]]>;
}
