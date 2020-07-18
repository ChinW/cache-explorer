/// <reference types="bluebird" />
import * as Promise from 'bluebird';
import { Address } from '../Address';
/**
 * Provides initial addresses for client to find and connect to a node &
 * Translates given address if necessary when connecting a service
 */
export interface AddressProvider {
    /**
     * @return The possible member addresses to connect to.
     */
    loadAddresses(): Promise<string[]>;
    /**
     * Translates the given address to another address specific to
     * network or service
     *
     * @param address to be translated
     * @return new address if given address is known, otherwise return null
     */
    translate(address: Address): Promise<Address>;
}
