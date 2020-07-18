import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
export interface ListRemoveListenerResponseParams {
    response: boolean;
}
export declare class ListRemoveListenerCodec {
    static encodeRequest(name: string, registrationId: UUID): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListRemoveListenerResponseParams;
}
