import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface MultiMapEntrySetResponseParams {
    response: Array<[Data, Data]>;
}
export declare class MultiMapEntrySetCodec {
    static encodeRequest(name: string): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): MultiMapEntrySetResponseParams;
}
