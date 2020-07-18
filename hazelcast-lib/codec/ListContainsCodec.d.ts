import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ListContainsResponseParams {
    response: boolean;
}
export declare class ListContainsCodec {
    static encodeRequest(name: string, value: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListContainsResponseParams;
}
