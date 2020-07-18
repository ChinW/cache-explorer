import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ListCompareAndRemoveAllResponseParams {
    response: boolean;
}
export declare class ListCompareAndRemoveAllCodec {
    static encodeRequest(name: string, values: Data[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListCompareAndRemoveAllResponseParams;
}
