import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ListAddResponseParams {
    response: boolean;
}
export declare class ListAddCodec {
    static encodeRequest(name: string, value: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListAddResponseParams;
}
