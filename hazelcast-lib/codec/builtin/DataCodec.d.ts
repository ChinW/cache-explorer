import { ClientMessage } from '../../ClientMessage';
import { Data } from '../../serialization/Data';
export declare class DataCodec {
    static encode(clientMessage: ClientMessage, data: Data): void;
    static encodeNullable(clientMessage: ClientMessage, data: Data): void;
    static decode(clientMessage: ClientMessage): Data;
    static decodeNullable(clientMessage: ClientMessage): Data;
}
