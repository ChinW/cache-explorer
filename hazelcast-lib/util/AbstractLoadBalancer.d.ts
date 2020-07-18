import { LoadBalancer } from '../LoadBalancer';
import { InitialMembershipListener } from '../core/InitialMembershipListener';
import { Cluster } from '../core/Cluster';
import { ClientConfig } from '../config/Config';
import { InitialMembershipEvent } from '../core/InitialMembershipEvent';
import { MembershipEvent } from '../core/MembershipEvent';
import { Member } from '../core/Member';
export declare abstract class AbstractLoadBalancer implements LoadBalancer, InitialMembershipListener {
    private members;
    private cluster;
    abstract next(): Member;
    initLoadBalancer(cluster: Cluster, config: ClientConfig): void;
    init(event: InitialMembershipEvent): void;
    memberAdded(membership: MembershipEvent): void;
    memberRemoved(membership: MembershipEvent): void;
    protected getMembers(): Member[];
    private setMembers();
}
