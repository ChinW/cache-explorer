/// <reference types="node" />
import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
import { Address } from '../Address';
export interface ClientAuthenticationCustomResponseParams {
    status: number;
    address: Address;
    memberUuid: UUID;
    serializationVersion: number;
    serverHazelcastVersion: string;
    partitionCount: number;
    clusterId: UUID;
    failoverSupported: boolean;
}
export declare class ClientAuthenticationCustomCodec {
    static encodeRequest(clusterName: string, credentials: Buffer, uuid: UUID, clientType: string, serializationVersion: number, clientHazelcastVersion: string, clientName: string, labels: string[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ClientAuthenticationCustomResponseParams;
}
