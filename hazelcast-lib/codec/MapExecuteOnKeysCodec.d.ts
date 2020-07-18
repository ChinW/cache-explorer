import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MapExecuteOnKeysResponseParams {
    response: Array<[Data, Data]>;
}
export declare class MapExecuteOnKeysCodec {
    static encodeRequest(name: string, entryProcessor: Data, keys: Data[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapExecuteOnKeysResponseParams;
}
