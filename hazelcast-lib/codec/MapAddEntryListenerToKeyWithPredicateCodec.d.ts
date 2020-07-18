import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
import { UUID } from '../core/UUID';
export interface MapAddEntryListenerToKeyWithPredicateResponseParams {
    response: UUID;
}
export declare class MapAddEntryListenerToKeyWithPredicateCodec {
    static encodeRequest(name: string, key: Data, predicate: Data, includeValue: boolean, listenerFlags: number, localOnly: boolean): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapAddEntryListenerToKeyWithPredicateResponseParams;
    static handle(clientMessage: ClientMessage, handleEntryEvent?: (key: Data, value: Data, oldValue: Data, mergingValue: Data, eventType: number, uuid: UUID, numberOfAffectedEntries: number) => void): void;
}
