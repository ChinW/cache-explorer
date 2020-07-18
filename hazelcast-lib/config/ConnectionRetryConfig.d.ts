/**
 * Connection Retry Config is controls the period among the retries and when should a client gave up
 * retrying. Exponential behaviour can be chosen or jitter can be added to wait periods.
 */
export declare class ConnectionRetryConfig {
    /**
     * How long to wait after the first failure before retrying. Must be non-negative.
     */
    initialBackoffMillis: number;
    /**
     * When backoff reaches this upper bound, it does not increase any more. Must be non-negative.
     */
    maxBackoffMillis: number;
    /**
     * Timeout value in milliseconds for the client to give up to connect to the current cluster.
     */
    clusterConnectTimeoutMillis: number;
    /**
     * Factor with which to multiply backoff after a failed retry. Must be greater than or equal to 1.
     */
    multiplier: number;
    /**
     * By how much to randomize backoffs.
     * At each iteration calculated back-off is randomized via following method
     * Random(-jitter * current_backoff, jitter * current_backoff)
     * It must be in range [0.0, 1.0].
     */
    jitter: number;
}
