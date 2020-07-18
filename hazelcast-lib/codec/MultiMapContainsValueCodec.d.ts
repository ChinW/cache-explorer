import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MultiMapContainsValueResponseParams {
    response: boolean;
}
export declare class MultiMapContainsValueCodec {
    static encodeRequest(name: string, value: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MultiMapContainsValueResponseParams;
}
