import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ListCompareAndRetainAllResponseParams {
    response: boolean;
}
export declare class ListCompareAndRetainAllCodec {
    static encodeRequest(name: string, values: Data[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListCompareAndRetainAllResponseParams;
}
