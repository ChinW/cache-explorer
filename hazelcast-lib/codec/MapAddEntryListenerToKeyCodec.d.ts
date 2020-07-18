import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
import { UUID } from '../core/UUID';
export interface MapAddEntryListenerToKeyResponseParams {
    response: UUID;
}
export declare class MapAddEntryListenerToKeyCodec {
    static encodeRequest(name: string, key: Data, includeValue: boolean, listenerFlags: number, localOnly: boolean): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapAddEntryListenerToKeyResponseParams;
    static handle(clientMessage: ClientMessage, handleEntryEvent?: (key: Data, value: Data, oldValue: Data, mergingValue: Data, eventType: number, uuid: UUID, numberOfAffectedEntries: number) => void): void;
}
