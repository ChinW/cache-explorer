import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface SetAddResponseParams {
    response: boolean;
}
export declare class SetAddCodec {
    static encodeRequest(name: string, value: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): SetAddResponseParams;
}
