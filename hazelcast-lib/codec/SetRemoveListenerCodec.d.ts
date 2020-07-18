import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
export interface SetRemoveListenerResponseParams {
    response: boolean;
}
export declare class SetRemoveListenerCodec {
    static encodeRequest(name: string, registrationId: UUID): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): SetRemoveListenerResponseParams;
}
