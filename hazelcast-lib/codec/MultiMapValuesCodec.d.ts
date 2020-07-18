import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MultiMapValuesResponseParams {
    response: Data[];
}
export declare class MultiMapValuesCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MultiMapValuesResponseParams;
}
