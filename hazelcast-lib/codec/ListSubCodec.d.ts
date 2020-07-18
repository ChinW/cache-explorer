import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export interface ListSubResponseParams {
    response: Data[];
}
export declare class ListSubCodec {
    static encodeRequest(name: string, from: number, to: number): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ListSubResponseParams;
}
