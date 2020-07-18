import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
import { UUID } from '../core/UUID';
export interface MapAddEntryListenerWithPredicateResponseParams {
    response: UUID;
}
export declare class MapAddEntryListenerWithPredicateCodec {
    static encodeRequest(name: string, predicate: Data, includeValue: boolean, listenerFlags: number, localOnly: boolean): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapAddEntryListenerWithPredicateResponseParams;
    static handle(clientMessage: ClientMessage, handleEntryEvent?: (key: Data, value: Data, oldValue: Data, mergingValue: Data, eventType: number, uuid: UUID, numberOfAffectedEntries: number) => void): void;
}
