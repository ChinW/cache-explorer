import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ListRemoveResponseParams {
    response: boolean;
}
export declare class ListRemoveCodec {
    static encodeRequest(name: string, value: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListRemoveResponseParams;
}
