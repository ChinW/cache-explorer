import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MultiMapKeySetResponseParams {
    response: Data[];
}
export declare class MultiMapKeySetCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MultiMapKeySetResponseParams;
}
