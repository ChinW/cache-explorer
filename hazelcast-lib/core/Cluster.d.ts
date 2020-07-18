import { MembershipListener } from './MembershipListener';
import { UUID } from './UUID';
import { Member } from './Member';
import { MemberSelector } from './MemberSelector';
export interface Cluster {
    /**
     * Adds MembershipListener to listen for membership updates.
     * <p>
     * The addMembershipListener method returns a register ID. This ID is needed to remove the MembershipListener using the
     * {@link #removeMembershipListener} method.
     * <p>
     * If the MembershipListener implements the {@link InitialMembershipListener} interface, it will also receive
     * the {@link InitialMembershipEvent}.
     * <p>
     * There is no check for duplicate registrations, so if you register the listener twice, it will get events twice.
     *
     * @param listener membership listener
     * @return the registration ID
     * @throws AssertionError if listener is null
     * @see #removeMembershipListener
     */
    addMembershipListener(listener: MembershipListener): UUID;
    /**
     * Removes the specified MembershipListener.
     * <p>
     * If the same MembershipListener is registered multiple times, it needs to be removed multiple times.
     *
     * This method can safely be called multiple times for the same registration ID; subsequent calls are ignored.
     *
     * @param registrationId the registrationId of MembershipListener to remove
     * @return true if the registration is removed, false otherwise
     * @throws AssertionError if the registration ID is null
     * @see #addMembershipListener
     */
    removeMembershipListener(registrationId: UUID): boolean;
    /**
     * List of the current members in the cluster.
     * <p>
     * Every member in the cluster returns the 'members' in the same order.
     * To obtain the oldest member (the master) in the cluster, you can retrieve the first item in the list.
     *
     * @param memberSelector Optional {@link MemberSelector} instance to filter members to return.
     *      If not provided, the returned list will contain all the available cluster members.
     * @return current members in the cluster
     */
    getMembers(memberSelector?: MemberSelector): Member[];
}
