import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
import { Data } from '../serialization/Data';
export interface QueueAddListenerResponseParams {
    response: UUID;
}
export declare class QueueAddListenerCodec {
    static encodeRequest(name: string, includeValue: boolean, localOnly: boolean): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueAddListenerResponseParams;
    static handle(clientMessage: ClientMessage, handleItemEvent?: (item: Data, uuid: UUID, eventType: number) => void): void;
}
