import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MapExecuteOnAllKeysResponseParams {
    response: Array<[Data, Data]>;
}
export declare class MapExecuteOnAllKeysCodec {
    static encodeRequest(name: string, entryProcessor: Data): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapExecuteOnAllKeysResponseParams;
}
