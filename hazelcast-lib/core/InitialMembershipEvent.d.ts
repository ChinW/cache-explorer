import { Member } from './Member';
/**
 * An event that is sent when a {@link InitialMembershipListener} registers itself on a cluster. For more
 * information, see the {@link InitialMembershipListener}.
 *
 * @see MembershipListener
 * @see MembershipEvent
 */
export declare class InitialMembershipEvent {
    members: Member[];
    constructor(members: Member[]);
}
