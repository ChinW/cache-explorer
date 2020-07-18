/// <reference types="long" />
import * as Long from 'long';
export declare class SimpleEntryView<K, V> {
    key: K;
    value: V;
    cost: Long;
    creationTime: Long;
    expirationTime: Long;
    hits: Long;
    lastAccessTime: Long;
    lastStoredTime: Long;
    lastUpdateTime: Long;
    version: Long;
    ttl: Long;
    maxIdle: Long;
    constructor(key: K, value: V, cost: Long, creationTime: Long, expirationTime: Long, hits: Long, lastAccessTime: Long, lastStoredTime: Long, lastUpdateTime: Long, version: Long, ttl: Long, maxIdle: Long);
}
