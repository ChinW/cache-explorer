import HazelcastClient from './HazelcastClient';
import { ClientConnectionManager } from './network/ClientConnectionManager';
/**
 * HeartbeatManager manager used by connection manager.
 */
export declare class HeartbeatManager {
    private client;
    private connectionManager;
    private readonly heartbeatTimeout;
    private readonly heartbeatInterval;
    private logger;
    private timer;
    constructor(client: HazelcastClient, connectionManager: ClientConnectionManager);
    /**
     * Starts sending periodic heartbeat operations.
     */
    start(): void;
    /**
     * Cancels the periodic heartbeat operation.
     */
    shutdown(): void;
    /**
     * Returns the heartbeat timeout in milliseconds.
     */
    getHeartbeatTimeout(): number;
    private heartbeatFunction();
    private checkConnection(now, connection);
    private onHeartbeatStopped(connection, reason);
}
