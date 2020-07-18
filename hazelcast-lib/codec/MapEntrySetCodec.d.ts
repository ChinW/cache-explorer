import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MapEntrySetResponseParams {
    response: Array<[Data, Data]>;
}
export declare class MapEntrySetCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MapEntrySetResponseParams;
}
