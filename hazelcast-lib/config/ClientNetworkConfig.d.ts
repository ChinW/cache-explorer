import { ClientCloudConfig } from './ClientCloudConfig';
import { SSLConfig } from './SSLConfig';
/**
 * Network configuration.
 */
export declare class ClientNetworkConfig {
    /**
     * Array of candidate addresses that client will use to establish initial connection.
     */
    addresses: string[];
    /**
     * hazelcast.cloud configuration to let the client connect the cluster via hazelcast.cloud
     */
    cloudConfig: ClientCloudConfig;
    /**
     * Timeout value in millis for nodes to accept client connection requests.
     */
    connectionTimeout: number;
    /**
     * true if redo operations are enabled (not implemented yet)
     */
    redoOperation: boolean;
    /**
     * If true, client will behave as smart client instead of dummy client. Smart client sends key based operations
     * to owner of the keys. Dummy client sends all operations to a single node. See http://docs.hazelcast.org to
     * learn about smart/dummy client.
     */
    smartRouting: boolean;
    /**
     * SSL configuration.
     */
    sslConfig: SSLConfig;
}
