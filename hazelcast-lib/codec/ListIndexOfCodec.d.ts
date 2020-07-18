import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ListIndexOfResponseParams {
    response: number;
}
export declare class ListIndexOfCodec {
    static encodeRequest(name: string, value: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListIndexOfResponseParams;
}
