import { ConnectionRetryConfig } from './ConnectionRetryConfig';
/**
 * Reconnect options.
 */
export declare enum ReconnectMode {
    /**
     * Prevent reconnect to cluster after a disconnect
     */
    OFF = "OFF",
    /**
     * Reconnect to cluster by blocking invocations
     */
    ON = "ON",
    /**
     * Reconnect to cluster without blocking invocations. Invocations will receive
     * {@link ClientOfflineError}
     */
    ASYNC = "ASYNC",
}
/**
 * Connection strategy configuration is used for setting custom strategies and configuring strategy parameters.
 */
export declare class ConnectionStrategyConfig {
    /**
     * Set true for non blocking {@link HazelcastClient#newHazelcastClient}. The client creation won't wait to
     * connect to cluster. The client instance will throw exception until it connects to cluster and become ready.
     * If set to false, {@link HazelcastClient#newHazelcastClient} will block until a cluster connection established and it's
     * ready to use client instance
     */
    asyncStart: boolean;
    /**
     * How a client reconnect to cluster after a disconnect can be configured. This parameter is used by default strategy and
     * custom implementations may ignore it if configured.
     */
    reconnectMode: ReconnectMode;
    /**
     * Connection Retry Config is controls the period among the retries and when should a client gave up
     * retrying. Exponential behaviour can be chosen or jitter can be added to wait periods.
     */
    connectionRetryConfig: ConnectionRetryConfig;
}
