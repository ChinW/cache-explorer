/// <reference types="bluebird" />
import { AddressProvider } from '../connection/AddressProvider';
import * as Promise from 'bluebird';
import { ILogger } from '../logging/ILogger';
import { Address } from '../Address';
export declare class HazelcastCloudAddressProvider implements AddressProvider {
    private readonly logger;
    private readonly cloudDiscovery;
    private privateToPublic;
    constructor(endpointUrl: string, connectionTimeoutMillis: number, logger: ILogger);
    loadAddresses(): Promise<string[]>;
    translate(address: Address): Promise<Address>;
    refresh(): Promise<void>;
}
