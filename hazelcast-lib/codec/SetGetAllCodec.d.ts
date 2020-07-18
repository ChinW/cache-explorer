import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface SetGetAllResponseParams {
    response: Data[];
}
export declare class SetGetAllCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): SetGetAllResponseParams;
}
