/// <reference types="bluebird" />
import * as Promise from 'bluebird';
import { DistributedObject } from '../DistributedObject';
import HazelcastClient from '../HazelcastClient';
import { DistributedObjectListener } from '../core/DistributedObjectListener';
export declare const NAMESPACE_SEPARATOR = "/";
export declare class ProxyManager {
    static readonly MAP_SERVICE: string;
    static readonly SET_SERVICE: string;
    static readonly LOCK_SERVICE: string;
    static readonly QUEUE_SERVICE: string;
    static readonly LIST_SERVICE: string;
    static readonly MULTIMAP_SERVICE: string;
    static readonly RINGBUFFER_SERVICE: string;
    static readonly REPLICATEDMAP_SERVICE: string;
    static readonly FLAKEID_SERVICE: string;
    static readonly PNCOUNTER_SERVICE: string;
    static readonly RELIABLETOPIC_SERVICE: string;
    readonly service: {
        [serviceName: string]: any;
    };
    private readonly proxies;
    private readonly client;
    private readonly logger;
    private readonly invocationTimeoutMillis;
    private readonly invocationRetryPauseMillis;
    constructor(client: HazelcastClient);
    init(): void;
    getOrCreateProxy(name: string, serviceName: string, createAtServer?: boolean): Promise<DistributedObject>;
    createDistributedObjectsOnCluster(): Promise<void>;
    getDistributedObjects(): Promise<DistributedObject[]>;
    destroyProxy(name: string, serviceName: string): Promise<void>;
    destroyProxyLocally(namespace: string): Promise<void>;
    addDistributedObjectListener(distributedObjectListener: DistributedObjectListener): Promise<string>;
    removeDistributedObjectListener(listenerId: string): Promise<boolean>;
    destroy(): void;
    private createProxy(name, serviceName);
    private createDistributedObjectListener();
    private initializeLocalProxy(name, serviceName, createAtServer);
}
