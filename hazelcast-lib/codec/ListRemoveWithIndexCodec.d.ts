import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ListRemoveWithIndexResponseParams {
    response: Data;
}
export declare class ListRemoveWithIndexCodec {
    static encodeRequest(name: string, index: number): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListRemoveWithIndexResponseParams;
}
