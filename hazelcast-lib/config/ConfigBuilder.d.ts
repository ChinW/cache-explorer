/// <reference types="bluebird" />
import * as Promise from 'bluebird';
import { ClientConfig } from './Config';
export declare class ConfigBuilder {
    private clientConfig;
    private loadedJson;
    private configLocator;
    loadConfig(): Promise<void>;
    build(): ClientConfig;
    private replaceImportsWithContent(jsonObject);
    private handleConfig(jsonObject);
    private handleConnectionStrategy(jsonObject);
    private handleConnectionRetry(jsonObject);
    private handleClientLabels(jsonObject);
    private handleNetwork(jsonObject);
    private handleHazelcastCloud(jsonObject);
    private parseProperties(jsonObject);
    private parseImportConfig(jsonObject);
    private handleSSL(jsonObject);
    private handleClusterMembers(jsonObject);
    private handleProperties(jsonObject);
    private handleListeners(jsonObject);
    private handleSerialization(jsonObject);
    private handleSerializers(jsonObject);
    private handleNearCaches(jsonObject);
    private handleReliableTopics(jsonObject);
    private handleFlakeIds(jsonObject);
    private handleLoadBalancer(jsonObject);
}
