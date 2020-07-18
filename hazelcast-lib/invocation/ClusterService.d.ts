/// <reference types="bluebird" />
import * as Promise from 'bluebird';
import { Member } from '../core/Member';
import { ClientInfo } from '../ClientInfo';
import HazelcastClient from '../HazelcastClient';
import { MemberSelector } from '../core/MemberSelector';
import { MembershipListener } from '../core/MembershipListener';
import { UUID } from '../core/UUID';
import { MemberInfo } from '../core/MemberInfo';
import { Cluster } from '../core/Cluster';
export declare enum MemberEvent {
    ADDED = 1,
    REMOVED = 2,
}
/**
 * Manages the relationship of this client with the cluster.
 */
export declare class ClusterService implements Cluster {
    private client;
    private memberListSnapshot;
    private listeners;
    private logger;
    private initialListFetched;
    private connectionManager;
    private readonly labels;
    constructor(client: HazelcastClient);
    /**
     * Gets the member with the given UUID.
     *
     * @param uuid The UUID of the member.
     * @return The member that was found, or undefined if not found.
     */
    getMember(uuid: UUID): Member;
    /**
     * Returns a collection of the members that satisfy the given {@link MemberSelector}.
     *
     * @param selector {@link MemberSelector} instance to filter members to return
     * @return members that satisfy the given {@link MemberSelector}.
     */
    getMembers(selector?: MemberSelector): Member[];
    /**
     * Gets the current number of members.
     *
     * @return The current number of members.
     */
    getSize(): number;
    /**
     * @return The {@link ClientInfo} instance representing the local client.
     */
    getLocalClient(): ClientInfo;
    /**
     * @param listener The listener to be registered.
     * @return The registration ID
     */
    addMembershipListener(listener: MembershipListener): UUID;
    /**
     * @param registrationId The registrationId of the listener to be removed.
     * @return true if successfully removed, false otherwise.
     */
    removeMembershipListener(registrationId: UUID): boolean;
    start(configuredListeners: MembershipListener[]): void;
    waitInitialMemberListFetched(): Promise<void>;
    clearMemberListVersion(): void;
    reset(): void;
    handleMembersViewEvent(memberListVersion: number, memberInfos: MemberInfo[]): void;
    private fireEvents(events);
    private isInitialMembershipListener(listener);
    private applyInitialState(memberListVersion, memberInfos);
    private detectMembershipEvents(prevMembers, currentMembers);
    private createSnapshot(memberListVersion, memberInfos);
    private membersString(snapshot);
    private getMemberList();
}
