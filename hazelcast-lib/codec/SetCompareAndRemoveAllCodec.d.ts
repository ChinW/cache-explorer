import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface SetCompareAndRemoveAllResponseParams {
    response: boolean;
}
export declare class SetCompareAndRemoveAllCodec {
    static encodeRequest(name: string, values: Data[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): SetCompareAndRemoveAllResponseParams;
}
