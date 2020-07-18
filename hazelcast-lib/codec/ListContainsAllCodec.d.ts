import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ListContainsAllResponseParams {
    response: boolean;
}
export declare class ListContainsAllCodec {
    static encodeRequest(name: string, values: Data[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListContainsAllResponseParams;
}
