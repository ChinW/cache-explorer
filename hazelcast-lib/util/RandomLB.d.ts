import { AbstractLoadBalancer } from './AbstractLoadBalancer';
import { Member } from '../core/Member';
/**
 * A {@link LoadBalancer} that selects a random member to route to.
 */
export declare class RandomLB extends AbstractLoadBalancer {
    next(): Member;
}
