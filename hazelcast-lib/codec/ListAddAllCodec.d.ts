import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ListAddAllResponseParams {
    response: boolean;
}
export declare class ListAddAllCodec {
    static encodeRequest(name: string, valueList: Data[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListAddAllResponseParams;
}
