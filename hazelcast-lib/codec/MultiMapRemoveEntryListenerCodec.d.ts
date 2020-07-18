import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
export interface MultiMapRemoveEntryListenerResponseParams {
    response: boolean;
}
export declare class MultiMapRemoveEntryListenerCodec {
    static encodeRequest(name: string, registrationId: UUID): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MultiMapRemoveEntryListenerResponseParams;
}
