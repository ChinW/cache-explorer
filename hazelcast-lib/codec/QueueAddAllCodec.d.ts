import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface QueueAddAllResponseParams {
    response: boolean;
}
export declare class QueueAddAllCodec {
    static encodeRequest(name: string, dataList: Data[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueAddAllResponseParams;
}
