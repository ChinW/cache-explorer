import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ListLastIndexOfResponseParams {
    response: number;
}
export declare class ListLastIndexOfCodec {
    static encodeRequest(name: string, value: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListLastIndexOfResponseParams;
}
