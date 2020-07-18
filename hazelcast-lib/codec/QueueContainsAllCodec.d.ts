import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface QueueContainsAllResponseParams {
    response: boolean;
}
export declare class QueueContainsAllCodec {
    static encodeRequest(name: string, dataList: Data[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueContainsAllResponseParams;
}
