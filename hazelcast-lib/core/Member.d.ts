import { Address } from '../Address';
import { UUID } from './UUID';
import { MemberVersion } from './MemberVersion';
export declare class Member {
    /**
     * Network address of member.
     */
    address: Address;
    /**
     * Unique id of member in cluster.
     */
    uuid: UUID;
    /**
     * true if member is a lite member.
     */
    liteMember: boolean;
    attributes: Map<string, string>;
    version: MemberVersion;
    constructor(address: Address, uuid: UUID, attributes: Map<string, string>, liteMember: boolean, version: MemberVersion);
    equals(other: Member): boolean;
    toString(): string;
    id(): string;
}
