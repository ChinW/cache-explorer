/// <reference types="long" />
import HazelcastClient from '../HazelcastClient';
import { ClientConnection } from '../network/ClientConnection';
import { Task } from '../Util';
import * as Long from 'long';
/**
 * This class is the main entry point for collecting and sending the client
 * statistics to the cluster. If the client statistics feature is enabled,
 * it will be scheduled for periodic statistics collection and sent.
 */
export declare class Statistics {
    static readonly PERIOD_SECONDS_DEFAULT_VALUE: number;
    private static readonly ENABLED;
    private static readonly PERIOD_SECONDS;
    private static readonly NEAR_CACHE_CATEGORY_PREFIX;
    private static readonly STAT_SEPARATOR;
    private static readonly KEY_VALUE_SEPARATOR;
    private static readonly ESCAPE_CHAR;
    private static readonly EMPTY_STAT_VALUE;
    private readonly allGauges;
    private readonly enabled;
    private readonly properties;
    private readonly logger;
    private client;
    private task;
    constructor(clientInstance: HazelcastClient);
    /**
     * Registers all client statistics and schedules periodic collection of stats.
     */
    start(): void;
    stop(): void;
    /**
     * @param periodSeconds the interval at which the statistics collection and send is being run
     */
    schedulePeriodicStatisticsSendTask(periodSeconds: number): Task;
    sendStats(collectionTimestamp: Long, newStats: string, connection: ClientConnection): void;
    private registerMetrics();
    private registerGauge(gaugeName, gaugeFunc);
    private addStat(stats, name, value, keyPrefix?);
    private addEmptyStat(stats, name, keyPrefix);
    private fillMetrics(stats, connection);
    private getNameWithPrefix(name);
    private escapeSpecialCharacters(buffer, start);
    private addNearCacheStats(stats);
}
