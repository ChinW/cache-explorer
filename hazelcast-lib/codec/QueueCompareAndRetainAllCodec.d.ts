import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface QueueCompareAndRetainAllResponseParams {
    response: boolean;
}
export declare class QueueCompareAndRetainAllCodec {
    static encodeRequest(name: string, dataList: Data[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): QueueCompareAndRetainAllResponseParams;
}
