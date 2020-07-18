import { AbstractLoadBalancer } from './AbstractLoadBalancer';
import { Member } from '../core/Member';
/**
 * A {@link LoadBalancer} implementation that relies on using round robin
 * to a next member to send a request to.
 */
export declare class RoundRobinLB extends AbstractLoadBalancer {
    private index;
    constructor();
    next(): Member;
}
