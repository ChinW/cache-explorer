import { TopicOverloadPolicy } from '../proxy/topic/TopicOverloadPolicy';
import { ClientNetworkConfig } from './ClientNetworkConfig';
import { EvictionPolicy } from './EvictionPolicy';
import { FlakeIdGeneratorConfig } from './FlakeIdGeneratorConfig';
import { ImportConfig, ListenerImportConfig } from './ImportConfig';
import { InMemoryFormat } from './InMemoryFormat';
import { ListenerConfig } from './ListenerConfig';
import { NearCacheConfig } from './NearCacheConfig';
import { SSLConfig } from './SSLConfig';
import { Properties } from './Properties';
import { ReliableTopicConfig } from './ReliableTopicConfig';
import { SerializationConfig } from './SerializationConfig';
import { ILogger } from '../logging/ILogger';
import { JsonStringDeserializationPolicy } from './JsonStringDeserializationPolicy';
import { ConnectionStrategyConfig, ReconnectMode } from './ConnectionStrategyConfig';
import { LoadBalancer } from '../LoadBalancer';
import { IndexConfig } from './IndexConfig';
import { IndexType } from './IndexType';
import { ConnectionRetryConfig } from './ConnectionRetryConfig';
/**
 * Top level configuration object of Hazelcast client. Other configurations items are properties of this object.
 */
export declare class ClientConfig {
    properties: Properties;
    /**
     * Name of this client instance.
     */
    instanceName: string;
    networkConfig: ClientNetworkConfig;
    customLogger: ILogger;
    customCredentials: any;
    listeners: ListenerConfig;
    listenerConfigs: ListenerImportConfig[];
    serializationConfig: SerializationConfig;
    reliableTopicConfigs: {
        [name: string]: ReliableTopicConfig;
    };
    nearCacheConfigs: {
        [name: string]: NearCacheConfig;
    };
    flakeIdGeneratorConfigs: {
        [name: string]: FlakeIdGeneratorConfig;
    };
    connectionStrategyConfig: ConnectionStrategyConfig;
    clusterName: string;
    labels: Set<string>;
    loadBalancer: LoadBalancer;
    private configPatternMatcher;
    getInstanceName(): string;
    getReliableTopicConfig(name: string): ReliableTopicConfig;
    getNearCacheConfig(name: string): NearCacheConfig;
    getFlakeIdGeneratorConfig(name: string): FlakeIdGeneratorConfig;
    private lookupByPattern<T>(config, name);
}
export { ClientNetworkConfig };
export { TopicOverloadPolicy };
export { SerializationConfig };
export { ReliableTopicConfig };
export { EvictionPolicy };
export { InMemoryFormat };
export { NearCacheConfig };
export { ImportConfig };
export { FlakeIdGeneratorConfig };
export { SSLConfig };
export { JsonStringDeserializationPolicy };
export { IndexConfig };
export { IndexType };
export { ConnectionStrategyConfig };
export { ReconnectMode };
export { ConnectionRetryConfig };
