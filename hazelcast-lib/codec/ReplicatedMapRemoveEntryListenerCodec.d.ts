import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
export interface ReplicatedMapRemoveEntryListenerResponseParams {
    response: boolean;
}
export declare class ReplicatedMapRemoveEntryListenerCodec {
    static encodeRequest(name: string, registrationId: UUID): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ReplicatedMapRemoveEntryListenerResponseParams;
}
