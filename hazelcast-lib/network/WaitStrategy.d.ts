/// <reference types="bluebird" />
import { ILogger } from '../logging/ILogger';
import * as Promise from 'bluebird';
export declare class WaitStrategy {
    private readonly initialBackoffMillis;
    private readonly maxBackoffMillis;
    private readonly multiplier;
    private readonly jitter;
    private readonly clusterConnectTimeoutMillis;
    private logger;
    private attempt;
    private currentBackoffMillis;
    private clusterConnectAttemptBegin;
    constructor(initialBackoffMillis: number, maxBackoffMillis: number, multiplier: number, clusterConnectTimeoutMillis: number, jitter: number, logger: ILogger);
    reset(): void;
    sleep(): Promise<boolean>;
}
