import { ClientMessage } from '../../ClientMessage';
import { DistributedObjectInfo } from '../../DistributedObjectInfo';
export declare class DistributedObjectInfoCodec {
    static encode(clientMessage: ClientMessage, distributedObjectInfo: DistributedObjectInfo): void;
    static decode(clientMessage: ClientMessage): DistributedObjectInfo;
}
