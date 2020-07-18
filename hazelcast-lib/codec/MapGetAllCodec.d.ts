import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MapGetAllResponseParams {
    response: Array<[Data, Data]>;
}
export declare class MapGetAllCodec {
    static encodeRequest(name: string, keys: Data[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapGetAllResponseParams;
}
