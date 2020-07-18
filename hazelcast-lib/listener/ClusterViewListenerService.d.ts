import HazelcastClient from '../HazelcastClient';
/**
 * Adds cluster listener to one of the connections. If that connection is removed,
 * it registers connection to any other connection
 */
export declare class ClusterViewListenerService {
    private readonly client;
    private readonly clusterService;
    private readonly connectionManager;
    private readonly partitionService;
    private readonly logger;
    private listenerAddedConnection;
    constructor(client: HazelcastClient);
    start(): void;
    private connectionAdded(connection);
    private connectionRemoved(connection);
    private tryRegister(connection);
    private tryRegisterToRandomConnection(oldConnection);
    private createClusterViewEventHandler(connection);
}
