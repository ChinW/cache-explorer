import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface SetContainsResponseParams {
    response: boolean;
}
export declare class SetContainsCodec {
    static encodeRequest(name: string, value: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): SetContainsResponseParams;
}
