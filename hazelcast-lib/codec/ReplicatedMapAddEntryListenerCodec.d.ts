import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
import { Data } from '../serialization/Data';
export interface ReplicatedMapAddEntryListenerResponseParams {
    response: UUID;
}
export declare class ReplicatedMapAddEntryListenerCodec {
    static encodeRequest(name: string, localOnly: boolean): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ReplicatedMapAddEntryListenerResponseParams;
    static handle(clientMessage: ClientMessage, handleEntryEvent?: (key: Data, value: Data, oldValue: Data, mergingValue: Data, eventType: number, uuid: UUID, numberOfAffectedEntries: number) => void): void;
}
