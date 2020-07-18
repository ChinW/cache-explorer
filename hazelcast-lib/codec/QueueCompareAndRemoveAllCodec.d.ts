import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface QueueCompareAndRemoveAllResponseParams {
    response: boolean;
}
export declare class QueueCompareAndRemoveAllCodec {
    static encodeRequest(name: string, dataList: Data[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueCompareAndRemoveAllResponseParams;
}
