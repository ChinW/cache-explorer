/// <reference types="node" />
/// <reference types="bluebird" />
import * as Promise from 'bluebird';
import { EventEmitter } from 'events';
import HazelcastClient from '../HazelcastClient';
import { ClientConnection } from './ClientConnection';
import { Address } from '../Address';
import { UUID } from '../core/UUID';
/**
 * Maintains connections between the client and members of the cluster.
 */
export declare class ClientConnectionManager extends EventEmitter {
    private connectionIdCounter;
    private alive;
    private readonly logger;
    private readonly client;
    private readonly labels;
    private readonly shuffleMemberList;
    private readonly asyncStart;
    private readonly reconnectMode;
    private readonly isSmartRoutingEnabled;
    private connectionTimeoutMillis;
    private heartbeatManager;
    private authenticationTimeout;
    private clientUuid;
    private waitStrategy;
    private loadBalancer;
    private activeConnections;
    private pendingConnections;
    private clusterId;
    private clientState;
    private connectToClusterTaskSubmitted;
    private reconnectToMembersTask;
    private connectingAddresses;
    constructor(client: HazelcastClient);
    start(): Promise<void>;
    connectToAllClusterMembers(): Promise<void>;
    shutdown(): void;
    getConnection(uuid: UUID): ClientConnection;
    checkIfInvocationAllowed(): Error;
    getActiveConnections(): ClientConnection[];
    isAlive(): boolean;
    getClientUuid(): UUID;
    getOrConnect(address: Address): Promise<ClientConnection>;
    getRandomConnection(): ClientConnection;
    onConnectionClose(connection: ClientConnection): void;
    private initWaitStrategy(config);
    private initConnectionTimeoutMillis();
    private connectToCluster();
    private submitConnectToClusterTask();
    private doConnectToCluster();
    private tryConnectingToAddresses(triedAddresses);
    private tryConnectingToAddress(index, addresses, triedAddresses);
    private connect(address);
    private emitLifecycleEvent(state);
    private getPossibleMemberAddresses();
    private getConnectionFromAddress(address);
    private initiateCommunication(socket);
    private triggerConnect(translatedAddress);
    private connectTLSSocket(address, configOpts);
    private connectNetSocket(address);
    private emitConnectionAddedEvent(connection);
    private emitConnectionRemovedEvent(connection);
    private translate(target);
    private triggerClusterReconnection();
    private shutdownClient();
    private reconnectToMembers();
    private authenticateOnCluster(connection);
    private handleSuccessfulAuth(connection, response);
    private encodeAuthenticationRequest();
    private checkPartitionCount(newPartitionCount);
    private initializeClientOnCluster(targetClusterId);
    private tryConnectToAllClusterMembers(members);
}
