import { ClientConfig } from './config/Config';
import { Cluster } from './core/Cluster';
import { Member } from './core/Member';
/**
 * {@link LoadBalancer} allows you to send operations to one of a number of endpoints (Members).
 * It is up to the implementation to use different load balancing policies.
 * <p>
 * If Client is configured with {@link ClientNetworkConfig#smartRouting},
 * only the operations that are not key based will be routed to the endpoint
 * returned by the LoadBalancer. If it is not, the LoadBalancer will not be used.
 * <p>
 */
export interface LoadBalancer {
    /**
     * Initializes the LoadBalancer.
     *
     * @param cluster the Cluster this LoadBalancer uses to select members from.
     * @param config  the ClientConfig.
     */
    initLoadBalancer(cluster: Cluster, config: ClientConfig): void;
    /**
     * Returns the next member to route to.
     *
     * @return Returns the next member or null if no member is available
     */
    next(): Member;
}
