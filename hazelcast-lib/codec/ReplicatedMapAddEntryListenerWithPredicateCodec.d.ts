import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
import { UUID } from '../core/UUID';
export interface ReplicatedMapAddEntryListenerWithPredicateResponseParams {
    response: UUID;
}
export declare class ReplicatedMapAddEntryListenerWithPredicateCodec {
    static encodeRequest(name: string, predicate: Data, localOnly: boolean): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ReplicatedMapAddEntryListenerWithPredicateResponseParams;
    static handle(clientMessage: ClientMessage, handleEntryEvent?: (key: Data, value: Data, oldValue: Data, mergingValue: Data, eventType: number, uuid: UUID, numberOfAffectedEntries: number) => void): void;
}
