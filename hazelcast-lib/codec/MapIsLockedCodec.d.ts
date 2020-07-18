import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MapIsLockedResponseParams {
    response: boolean;
}
export declare class MapIsLockedCodec {
    static encodeRequest(name: string, key: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapIsLockedResponseParams;
}
