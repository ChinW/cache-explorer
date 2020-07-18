import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ListAddAllWithIndexResponseParams {
    response: boolean;
}
export declare class ListAddAllWithIndexCodec {
    static encodeRequest(name: string, index: number, valueList: Data[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListAddAllWithIndexResponseParams;
}
