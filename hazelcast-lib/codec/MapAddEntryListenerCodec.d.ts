import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
import { Data } from '../serialization/Data';
export interface MapAddEntryListenerResponseParams {
    response: UUID;
}
export declare class MapAddEntryListenerCodec {
    static encodeRequest(name: string, includeValue: boolean, listenerFlags: number, localOnly: boolean): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapAddEntryListenerResponseParams;
    static handle(clientMessage: ClientMessage, handleEntryEvent?: (key: Data, value: Data, oldValue: Data, mergingValue: Data, eventType: number, uuid: UUID, numberOfAffectedEntries: number) => void): void;
}
