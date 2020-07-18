import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
import { UUID } from '../core/UUID';
export interface ReplicatedMapAddEntryListenerToKeyWithPredicateResponseParams {
    response: UUID;
}
export declare class ReplicatedMapAddEntryListenerToKeyWithPredicateCodec {
    static encodeRequest(name: string, key: Data, predicate: Data, localOnly: boolean): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ReplicatedMapAddEntryListenerToKeyWithPredicateResponseParams;
    static handle(clientMessage: ClientMessage, handleEntryEvent?: (key: Data, value: Data, oldValue: Data, mergingValue: Data, eventType: number, uuid: UUID, numberOfAffectedEntries: number) => void): void;
}
