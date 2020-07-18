import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface SetCompareAndRetainAllResponseParams {
    response: boolean;
}
export declare class SetCompareAndRetainAllCodec {
    static encodeRequest(name: string, values: Data[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): SetCompareAndRetainAllResponseParams;
}
