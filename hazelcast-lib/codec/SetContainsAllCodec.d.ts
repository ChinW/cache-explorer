import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface SetContainsAllResponseParams {
    response: boolean;
}
export declare class SetContainsAllCodec {
    static encodeRequest(name: string, items: Data[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): SetContainsAllResponseParams;
}
