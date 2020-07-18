import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
import { Data } from '../serialization/Data';
export interface ListAddListenerResponseParams {
    response: UUID;
}
export declare class ListAddListenerCodec {
    static encodeRequest(name: string, includeValue: boolean, localOnly: boolean): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListAddListenerResponseParams;
    static handle(clientMessage: ClientMessage, handleItemEvent?: (item: Data, uuid: UUID, eventType: number) => void): void;
}
