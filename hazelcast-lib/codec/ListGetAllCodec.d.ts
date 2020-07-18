import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ListGetAllResponseParams {
    response: Data[];
}
export declare class ListGetAllCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListGetAllResponseParams;
}
