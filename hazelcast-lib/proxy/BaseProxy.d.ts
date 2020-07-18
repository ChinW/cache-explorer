/// <reference types="bluebird" />
import * as Promise from 'bluebird';
import HazelcastClient from '../HazelcastClient';
import { Data } from '../serialization/Data';
import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
/**
 * Common super class for any proxy.
 */
export declare class BaseProxy {
    protected client: HazelcastClient;
    protected name: string;
    protected serviceName: string;
    constructor(client: HazelcastClient, serviceName: string, name: string);
    getPartitionKey(): string;
    /**
     * Returns name of the proxy.
     * @returns
     */
    getName(): string;
    /**
     * Returns name of the service which this proxy belongs to.
     * Refer to service field of {@link ProxyManager} for service names.
     * @returns
     */
    getServiceName(): string;
    /**
     * Deletes the proxy object and frees allocated resources on cluster.
     * @returns
     */
    destroy(): Promise<void>;
    /**
     * Destroys this client proxy instance locally without issuing distributed
     * object destroy request to the cluster as the destroy method does.
     * <p>
     * The local destruction operation still may perform some communication
     * with the cluster; for example, to unregister remote event subscriptions.
     */
    destroyLocally(): Promise<void>;
    protected postDestroy(): Promise<void>;
    /**
     * Encodes a request from a codec and invokes it on owner node of given key.
     * @param codec
     * @param partitionKey
     * @param codecArguments
     * @returns
     */
    protected encodeInvokeOnKey(codec: any, partitionKey: any, ...codecArguments: any[]): Promise<ClientMessage>;
    /**
     * Encodes a request from a codec and invokes it on any node.
     * @param codec
     * @param codecArguments
     * @returns
     */
    protected encodeInvokeOnRandomTarget(codec: any, ...codecArguments: any[]): Promise<ClientMessage>;
    protected encodeInvokeOnTarget(codec: any, target: UUID, ...codecArguments: any[]): Promise<ClientMessage>;
    /**
     * Encodes a request from a codec and invokes it on owner node of given partition.
     * @param codec
     * @param partitionId
     * @param codecArguments
     * @returns
     */
    protected encodeInvokeOnPartition(codec: any, partitionId: number, ...codecArguments: any[]): Promise<ClientMessage>;
    /**
     * Serializes an object according to serialization settings of the client.
     * @param object
     * @returns
     */
    protected toData(object: any): Data;
    /**
     * De-serializes an object from binary form according to serialization settings of the client.
     * @param data
     * @returns {any}
     */
    protected toObject(data: Data): any;
    protected getConnectedServerVersion(): number;
}
