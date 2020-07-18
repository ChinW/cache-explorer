import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
import { UUID } from '../core/UUID';
export interface MultiMapAddEntryListenerToKeyResponseParams {
    response: UUID;
}
export declare class MultiMapAddEntryListenerToKeyCodec {
    static encodeRequest(name: string, key: Data, includeValue: boolean, localOnly: boolean): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MultiMapAddEntryListenerToKeyResponseParams;
    static handle(clientMessage: ClientMessage, handleEntryEvent?: (key: Data, value: Data, oldValue: Data, mergingValue: Data, eventType: number, uuid: UUID, numberOfAffectedEntries: number) => void): void;
}
