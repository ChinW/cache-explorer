import { ClientMessage } from '../../ClientMessage';
import { MemberVersion } from '../../core/MemberVersion';
export declare class MemberVersionCodec {
    static encode(clientMessage: ClientMessage, memberVersion: MemberVersion): void;
    static decode(clientMessage: ClientMessage): MemberVersion;
}
