import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
export interface MapRemoveEntryListenerResponseParams {
    response: boolean;
}
export declare class MapRemoveEntryListenerCodec {
    static encodeRequest(name: string, registrationId: UUID): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapRemoveEntryListenerResponseParams;
}
