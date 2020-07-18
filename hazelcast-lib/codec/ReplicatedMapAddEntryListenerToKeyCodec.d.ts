import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
import { UUID } from '../core/UUID';
export interface ReplicatedMapAddEntryListenerToKeyResponseParams {
    response: UUID;
}
export declare class ReplicatedMapAddEntryListenerToKeyCodec {
    static encodeRequest(name: string, key: Data, localOnly: boolean): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ReplicatedMapAddEntryListenerToKeyResponseParams;
    static handle(clientMessage: ClientMessage, handleEntryEvent?: (key: Data, value: Data, oldValue: Data, mergingValue: Data, eventType: number, uuid: UUID, numberOfAffectedEntries: number) => void): void;
}
