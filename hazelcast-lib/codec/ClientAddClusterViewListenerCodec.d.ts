import { ClientMessage } from '../ClientMessage';
import { MemberInfo } from '../core/MemberInfo';
import { UUID } from '../core/UUID';
export declare class ClientAddClusterViewListenerCodec {
    static encodeRequest(): ClientMessage;
    static handle(clientMessage: ClientMessage, handleMembersViewEvent?: (version: number, memberInfos: MemberInfo[]) => void, handlePartitionsViewEvent?: (version: number, partitions: Array<[UUID, number[]]>) => void): void;
}
