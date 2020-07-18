import { ClientMessage } from '../../ClientMessage';
import { MemberInfo } from '../../core/MemberInfo';
export declare class MemberInfoCodec {
    static encode(clientMessage: ClientMessage, memberInfo: MemberInfo): void;
    static decode(clientMessage: ClientMessage): MemberInfo;
}
