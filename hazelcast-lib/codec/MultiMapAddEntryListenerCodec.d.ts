import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
import { Data } from '../serialization/Data';
export interface MultiMapAddEntryListenerResponseParams {
    response: UUID;
}
export declare class MultiMapAddEntryListenerCodec {
    static encodeRequest(name: string, includeValue: boolean, localOnly: boolean): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MultiMapAddEntryListenerResponseParams;
    static handle(clientMessage: ClientMessage, handleEntryEvent?: (key: Data, value: Data, oldValue: Data, mergingValue: Data, eventType: number, uuid: UUID, numberOfAffectedEntries: number) => void): void;
}
