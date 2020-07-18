import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
export interface ClientAddDistributedObjectListenerResponseParams {
    response: UUID;
}
export declare class ClientAddDistributedObjectListenerCodec {
    static encodeRequest(localOnly: boolean): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ClientAddDistributedObjectListenerResponseParams;
    static handle(clientMessage: ClientMessage, handleDistributedObjectEvent?: (name: string, serviceName: string, eventType: string, source: UUID) => void): void;
}
