import { ClientMessage } from '../../ClientMessage';
import { IndexConfig } from '../../config/IndexConfig';
export declare class IndexConfigCodec {
    static encode(clientMessage: ClientMessage, indexConfig: IndexConfig): void;
    static decode(clientMessage: ClientMessage): IndexConfig;
}
