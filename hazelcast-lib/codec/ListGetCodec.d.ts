import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ListGetResponseParams {
    response: Data;
}
export declare class ListGetCodec {
    static encodeRequest(name: string, index: number): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListGetResponseParams;
}
