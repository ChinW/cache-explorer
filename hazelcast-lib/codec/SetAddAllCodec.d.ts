import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface SetAddAllResponseParams {
    response: boolean;
}
export declare class SetAddAllCodec {
    static encodeRequest(name: string, valueList: Data[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): SetAddAllResponseParams;
}
