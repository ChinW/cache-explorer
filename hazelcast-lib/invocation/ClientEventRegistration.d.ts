import { ListenerMessageCodec } from '../ListenerMessageCodec';
import { ClientConnection } from '../network/ClientConnection';
import { UUID } from '../core/UUID';
export declare class ClientEventRegistration {
    readonly serverRegistrationId: UUID;
    readonly correlationId: number;
    readonly subscriber: ClientConnection;
    readonly codec: ListenerMessageCodec;
    constructor(serverRegistrationId: UUID, correlationId: number, subscriber: ClientConnection, codec: ListenerMessageCodec);
    toString(): string;
}
