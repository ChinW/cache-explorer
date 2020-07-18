/// <reference types="node" />
import { EventEmitter } from 'events';
import HazelcastClient from './HazelcastClient';
/**
 * Lifecycle states.
 */
export declare enum LifecycleState {
    /**
     * Fired when the client is starting.
     */
    STARTING = "STARTING",
    /**
     * Fired when the client's start is completed.
     */
    STARTED = "STARTED",
    /**
     * Fired when the client is shutting down.
     */
    SHUTTING_DOWN = "SHUTTING_DOWN",
    /**
     * Fired when the client's shut down is completed.
     */
    SHUTDOWN = "SHUTDOWN",
    /**
     * Fired when the client is connected to the member.
     */
    CONNECTED = "CONNECTED",
    /**
     * Fired when the client is disconnected from the member.
     */
    DISCONNECTED = "DISCONNECTED",
    /**
     * Fired when the client is connected to a new cluster.
     */
    CHANGED_CLUSTER = "CHANGED_CLUSTER",
}
/**
 * LifecycleService
 */
export declare class LifecycleService extends EventEmitter {
    private active;
    private client;
    private logger;
    constructor(client: HazelcastClient);
    /**
     * Causes LifecycleService to emit given event to all registered listeners.
     * @param state
     */
    emitLifecycleEvent(state: LifecycleState): void;
    /**
     * Returns the active state of the client.
     * @returns {boolean}
     */
    isRunning(): boolean;
    start(): void;
    shutdown(): void;
}
