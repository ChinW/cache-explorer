import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ListSetResponseParams {
    response: Data;
}
export declare class ListSetCodec {
    static encodeRequest(name: string, index: number, value: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListSetResponseParams;
}
