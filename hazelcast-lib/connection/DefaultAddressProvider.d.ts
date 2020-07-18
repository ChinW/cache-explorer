/// <reference types="bluebird" />
import { AddressProvider } from './AddressProvider';
import { ClientNetworkConfig } from '../config/ClientNetworkConfig';
import * as Promise from 'bluebird';
import { Address } from '../Address';
/**
 * Default address provider of Hazelcast.
 *
 * Loads addresses from the Hazelcast configuration.
 */
export declare class DefaultAddressProvider implements AddressProvider {
    private networkConfig;
    constructor(networkConfig: ClientNetworkConfig);
    loadAddresses(): Promise<string[]>;
    translate(address: Address): Promise<Address>;
}
