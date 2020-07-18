import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MultiMapIsLockedResponseParams {
    response: boolean;
}
export declare class MultiMapIsLockedCodec {
    static encodeRequest(name: string, key: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MultiMapIsLockedResponseParams;
}
