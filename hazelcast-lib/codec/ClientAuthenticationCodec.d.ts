import { ClientMessage } from '../ClientMessage';
import { UUID } from '../core/UUID';
import { Address } from '../Address';
export interface ClientAuthenticationResponseParams {
    status: number;
    address: Address;
    memberUuid: UUID;
    serializationVersion: number;
    serverHazelcastVersion: string;
    partitionCount: number;
    clusterId: UUID;
    failoverSupported: boolean;
}
export declare class ClientAuthenticationCodec {
    static encodeRequest(clusterName: string, username: string, password: string, uuid: UUID, clientType: string, serializationVersion: number, clientHazelcastVersion: string, clientName: string, labels: string[]): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): ClientAuthenticationResponseParams;
}
