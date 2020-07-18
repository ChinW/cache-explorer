import { MembershipListener } from './MembershipListener';
import { InitialMembershipEvent } from './InitialMembershipEvent';
/**
 * The InitialMembershipListener is a {@link MembershipListener} that first receives a
 * {@link InitialMembershipEvent} when it is registered so it immediately knows which members are available. After
 * that event has been received, it will receive the normal MembershipEvents.
 *
 * When the InitialMembershipListener already is registered on a cluster and is registered again on the same
 * Cluster instance, it will not receive an additional MembershipInitializeEvent. This is a once only event.
 */
export interface InitialMembershipListener extends MembershipListener {
    /**
     * Called when this listener is registered.
     *
     * @param event the MembershipInitializeEvent received when the listener is registered
     */
    init(event: InitialMembershipEvent): void;
}
