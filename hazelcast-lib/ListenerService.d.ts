/// <reference types="bluebird" />
import * as Promise from 'bluebird';
import HazelcastClient from './HazelcastClient';
import { ClientConnection } from './network/ClientConnection';
import { ClientEventRegistration } from './invocation/ClientEventRegistration';
import { ListenerMessageCodec } from './ListenerMessageCodec';
export declare class ListenerService {
    private client;
    private logger;
    private isSmartService;
    private activeRegistrations;
    private userRegistrationKeyInformation;
    constructor(client: HazelcastClient);
    start(): void;
    onConnectionAdded(connection: ClientConnection): void;
    onConnectionRemoved(connection: ClientConnection): void;
    reregisterListeners(): void;
    reregisterListenersOnConnection(connection: ClientConnection): void;
    removeRegistrationsOnConnection(connection: ClientConnection): void;
    invokeRegistrationFromRecord(userRegistrationKey: string, connection: ClientConnection): Promise<ClientEventRegistration>;
    registerListener(codec: ListenerMessageCodec, listenerHandlerFunc: Function): Promise<string>;
    deregisterListener(userRegistrationKey: string): Promise<boolean>;
    isSmart(): boolean;
}
