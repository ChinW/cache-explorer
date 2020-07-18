import HazelcastClient from './HazelcastClient';
import { ClientConnection } from './network/ClientConnection';
import { UUID } from './core/UUID';
/**
 * Partition service for Hazelcast clients.
 *
 * Allows to retrieve information about the partition count, the partition owner or the partitionId of a key.
 */
export declare class PartitionService {
    private client;
    private partitionTable;
    private partitionCount;
    private logger;
    constructor(client: HazelcastClient);
    /**
     * The partitions can be empty on the response, client will not apply the empty partition table.
     */
    handlePartitionViewEvent(connection: ClientConnection, partitions: Array<[UUID, number[]]>, partitionStateVersion: number): void;
    /**
     * @param partitionId
     * @return the owner of the partition or `undefined` if a partition is not assigned yet
     */
    getPartitionOwner(partitionId: number): UUID;
    /**
     * Computes the partition id for a given key.
     * @param key
     * @returns the partition id.
     * @throws ClientOfflineError if the partition table is not arrived yet.
     */
    getPartitionId(key: any): number;
    /**
     * If partition table is not fetched yet, this method returns zero
     *
     * @return the partition count
     */
    getPartitionCount(): number;
    /**
     * @param newPartitionCount
     * @return true if partition count can be set for the first time, or it is equal to
     * one that is already available, returns false otherwise
     */
    checkAndSetPartitionCount(newPartitionCount: number): boolean;
    private convertToMap(partitions);
    private logFailure(connection, partitionStateVersion, current, cause);
    private getPartitions();
    private shouldBeApplied(connection, partitions, partitionStateVersion, current);
}
