import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
export interface QueueRemoveListenerResponseParams {
    response: boolean;
}
export declare class QueueRemoveListenerCodec {
    static encodeRequest(name: string, registrationId: UUID): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueRemoveListenerResponseParams;
}
