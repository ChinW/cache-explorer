import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
export interface ClientRemoveDistributedObjectListenerResponseParams {
    response: boolean;
}
export declare class ClientRemoveDistributedObjectListenerCodec {
    static encodeRequest(registrationId: UUID): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ClientRemoveDistributedObjectListenerResponseParams;
}
