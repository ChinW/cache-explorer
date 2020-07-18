/// <reference types="node" />
/// <reference types="bluebird" />
import * as Promise from 'bluebird';
import * as net from 'net';
import { EventEmitter } from 'events';
import HazelcastClient from '../HazelcastClient';
import { Address } from '../Address';
import { UUID } from '../core/UUID';
import { ClientMessage } from '../ClientMessage';
export declare class PipelinedWriter extends EventEmitter {
    private readonly socket;
    private queue;
    private error;
    private scheduled;
    private readonly threshold;
    constructor(socket: net.Socket, threshold: number);
    write(buffer: Buffer, resolver: Promise.Resolver<void>): void;
    private schedule();
    private process();
    private handleError(err, sentResolvers);
}
export declare class DirectWriter extends EventEmitter {
    private readonly socket;
    constructor(socket: net.Socket);
    write(buffer: Buffer, resolver: Promise.Resolver<void>): void;
}
export declare class ClientMessageReader {
    private chunks;
    private chunksTotalSize;
    private frameSize;
    private flags;
    private clientMessage;
    append(buffer: Buffer): void;
    read(): ClientMessage;
    readFrame(): boolean;
    private reset();
    private readFrameSizeAndFlags();
}
export declare class FragmentedClientMessageHandler {
    private readonly fragmentedMessages;
    handleFragmentedMessage(clientMessage: ClientMessage, callback: Function): void;
    private mergeIntoExistingClientMessage(fragmentationId, clientMessage);
}
export declare class ClientConnection {
    private readonly connectionId;
    private remoteAddress;
    private remoteUuid;
    private readonly localAddress;
    private lastReadTimeMillis;
    private lastWriteTimeMillis;
    private readonly client;
    private readonly startTime;
    private closedTime;
    private closedReason;
    private closedCause;
    private connectedServerVersionString;
    private connectedServerVersion;
    private readonly socket;
    private readonly writer;
    private readonly reader;
    private readonly logger;
    private readonly fragmentedMessageHandler;
    constructor(client: HazelcastClient, remoteAddress: Address, socket: net.Socket, connectionId: number);
    /**
     * Returns the address of local port that is associated with this connection.
     * @returns
     */
    getLocalAddress(): Address;
    /**
     * Returns the address of remote node that is associated with this connection.
     * @returns
     */
    getRemoteAddress(): Address;
    setRemoteAddress(address: Address): void;
    getRemoteUuid(): UUID;
    setRemoteUuid(remoteUuid: UUID): void;
    write(buffer: Buffer): Promise<void>;
    setConnectedServerVersion(versionString: string): void;
    getConnectedServerVersion(): number;
    /**
     * Closes this connection.
     */
    close(reason: string, cause: Error): void;
    isAlive(): boolean;
    getStartTime(): number;
    getLastReadTimeMillis(): number;
    getLastWriteTimeMillis(): number;
    equals(other: ClientConnection): boolean;
    toString(): string;
    /**
     * Registers a function to pass received data on 'data' events on this connection.
     * @param callback
     */
    registerResponseCallback(callback: Function): void;
    private logClose();
}
