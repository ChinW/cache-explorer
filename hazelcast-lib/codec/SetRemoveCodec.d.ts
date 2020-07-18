import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface SetRemoveResponseParams {
    response: boolean;
}
export declare class SetRemoveCodec {
    static encodeRequest(name: string, value: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): SetRemoveResponseParams;
}
