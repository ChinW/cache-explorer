import { MembershipListener } from '../core/MembershipListener';
import { LifecycleState } from '../LifecycleService';
/**
 * Configurations for LifecycleListeners. These are registered as soon as client started.
 */
export declare class ListenerConfig {
    lifecycleListeners: Array<(state: LifecycleState) => void>;
    membershipListeners: MembershipListener[];
    addLifecycleListener(listener: (state: LifecycleState) => void): void;
    addMembershipListener(listener: MembershipListener): void;
    getLifecycleListeners(): Array<(state: LifecycleState) => void>;
    getMembershipListeners(): MembershipListener[];
}
