import { ClientMessage } from '../ClientMessage';
import { DistributedObjectInfo } from '../DistributedObjectInfo';
export interface ClientGetDistributedObjectsResponseParams {
    response: DistributedObjectInfo[];
}
export declare class ClientGetDistributedObjectsCodec {
    static encodeRequest(): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ClientGetDistributedObjectsResponseParams;
}
