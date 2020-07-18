"use strict";
/*
 * Copyright (c) 2008-2020, Hazelcast, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var Member_1 = require("../core/Member");
var ClientInfo_1 = require("../ClientInfo");
var HazelcastError_1 = require("../HazelcastError");
var Util_1 = require("../Util");
var MembershipEvent_1 = require("../core/MembershipEvent");
var UuidUtil_1 = require("../util/UuidUtil");
var InitialMembershipEvent_1 = require("../core/InitialMembershipEvent");
var MemberEvent;
(function (MemberEvent) {
    MemberEvent[MemberEvent["ADDED"] = 1] = "ADDED";
    MemberEvent[MemberEvent["REMOVED"] = 2] = "REMOVED";
})(MemberEvent = exports.MemberEvent || (exports.MemberEvent = {}));
var MemberListSnapshot = /** @class */ (function () {
    function MemberListSnapshot(version, members, memberList) {
        this.version = version;
        this.members = members;
        this.memberList = memberList;
    }
    return MemberListSnapshot;
}());
var EMPTY_SNAPSHOT = new MemberListSnapshot(-1, new Map(), []);
var INITIAL_MEMBERS_TIMEOUT_IN_MILLIS = 120 * 1000; // 120 seconds
/**
 * Manages the relationship of this client with the cluster.
 */
var ClusterService = /** @class */ (function () {
    function ClusterService(client) {
        this.memberListSnapshot = EMPTY_SNAPSHOT;
        this.listeners = new Map();
        this.initialListFetched = Util_1.DeferredPromise();
        this.client = client;
        this.labels = new Set(client.getConfig().labels);
        this.logger = client.getLoggingService().getLogger();
        this.connectionManager = client.getConnectionManager();
    }
    /**
     * Gets the member with the given UUID.
     *
     * @param uuid The UUID of the member.
     * @return The member that was found, or undefined if not found.
     */
    ClusterService.prototype.getMember = function (uuid) {
        Util_1.assertNotNull(uuid);
        return this.memberListSnapshot.members.get(uuid.toString());
    };
    /**
     * Returns a collection of the members that satisfy the given {@link MemberSelector}.
     *
     * @param selector {@link MemberSelector} instance to filter members to return
     * @return members that satisfy the given {@link MemberSelector}.
     */
    ClusterService.prototype.getMembers = function (selector) {
        var members = this.getMemberList();
        if (selector == null) {
            return members;
        }
        var selectedMembers = [];
        members.forEach(function (member) {
            if (selector.select(member)) {
                selectedMembers.push(member);
            }
        });
        return selectedMembers;
    };
    /**
     * Gets the current number of members.
     *
     * @return The current number of members.
     */
    ClusterService.prototype.getSize = function () {
        return this.memberListSnapshot.members.size;
    };
    /**
     * @return The {@link ClientInfo} instance representing the local client.
     */
    ClusterService.prototype.getLocalClient = function () {
        var connectionManager = this.client.getConnectionManager();
        var connection = connectionManager.getRandomConnection();
        var localAddress = connection != null ? connection.getLocalAddress() : null;
        var info = new ClientInfo_1.ClientInfo();
        info.uuid = connectionManager.getClientUuid();
        info.localAddress = localAddress;
        info.labels = this.labels;
        info.name = this.client.getName();
        return info;
    };
    /**
     * @param listener The listener to be registered.
     * @return The registration ID
     */
    ClusterService.prototype.addMembershipListener = function (listener) {
        Util_1.assertNotNull(listener);
        var registrationId = UuidUtil_1.UuidUtil.generate();
        this.listeners.set(registrationId.toString(), listener);
        if (this.isInitialMembershipListener(listener)) {
            var members = this.getMemberList();
            // if members are empty,it means initial event did not arrive yet
            // it will be redirected to listeners when it arrives see #handleInitialMembershipEvent
            if (members.length !== 0) {
                var event = new InitialMembershipEvent_1.InitialMembershipEvent(members);
                listener.init(event);
            }
        }
        return registrationId;
    };
    /**
     * @param registrationId The registrationId of the listener to be removed.
     * @return true if successfully removed, false otherwise.
     */
    ClusterService.prototype.removeMembershipListener = function (registrationId) {
        Util_1.assertNotNull(registrationId);
        return this.listeners.delete(registrationId.toString());
    };
    ClusterService.prototype.start = function (configuredListeners) {
        for (var _i = 0, configuredListeners_1 = configuredListeners; _i < configuredListeners_1.length; _i++) {
            var listener = configuredListeners_1[_i];
            this.addMembershipListener(listener);
        }
    };
    ClusterService.prototype.waitInitialMemberListFetched = function () {
        return this.initialListFetched.promise
            .timeout(INITIAL_MEMBERS_TIMEOUT_IN_MILLIS)
            .catch(function (error) {
            return Promise.reject(new HazelcastError_1.IllegalStateError('Could not get initial member list from the cluster!', error));
        });
    };
    ClusterService.prototype.clearMemberListVersion = function () {
        this.logger.trace('ClusterService', 'Resetting the member list version');
        if (this.memberListSnapshot !== EMPTY_SNAPSHOT) {
            this.memberListSnapshot.version = 0;
        }
    };
    ClusterService.prototype.reset = function () {
        this.logger.trace('ClusterService', 'Resetting the cluster snapshot');
        this.initialListFetched = Util_1.DeferredPromise();
        this.memberListSnapshot = EMPTY_SNAPSHOT;
    };
    ClusterService.prototype.handleMembersViewEvent = function (memberListVersion, memberInfos) {
        if (this.memberListSnapshot === EMPTY_SNAPSHOT) {
            this.applyInitialState(memberListVersion, memberInfos);
            this.initialListFetched.resolve();
            return;
        }
        if (memberListVersion >= this.memberListSnapshot.version) {
            var prevMembers = this.memberListSnapshot.memberList;
            var snapshot = this.createSnapshot(memberListVersion, memberInfos);
            this.memberListSnapshot = snapshot;
            var currentMembers = snapshot.memberList;
            var events = this.detectMembershipEvents(prevMembers, currentMembers);
            this.fireEvents(events);
        }
    };
    ClusterService.prototype.fireEvents = function (events) {
        var _loop_1 = function (event) {
            this_1.listeners.forEach(function (listener) {
                if (event.eventType === MemberEvent.ADDED && listener.memberAdded) {
                    listener.memberAdded(event);
                }
                else if (event.eventType === MemberEvent.REMOVED && listener.memberRemoved) {
                    listener.memberRemoved(event);
                }
            });
        };
        var this_1 = this;
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event = events_1[_i];
            _loop_1(event);
        }
    };
    ClusterService.prototype.isInitialMembershipListener = function (listener) {
        return listener.init !== undefined;
    };
    ClusterService.prototype.applyInitialState = function (memberListVersion, memberInfos) {
        var _this = this;
        var snapshot = this.createSnapshot(memberListVersion, memberInfos);
        this.memberListSnapshot = snapshot;
        this.logger.info('ClusterService', this.membersString(snapshot));
        var members = snapshot.memberList;
        var event = new InitialMembershipEvent_1.InitialMembershipEvent(members);
        this.listeners.forEach(function (listener) {
            if (_this.isInitialMembershipListener(listener)) {
                listener.init(event);
            }
        });
    };
    ClusterService.prototype.detectMembershipEvents = function (prevMembers, currentMembers) {
        var _this = this;
        var newMembers = new Array();
        var deadMembers = new Map();
        for (var _i = 0, prevMembers_1 = prevMembers; _i < prevMembers_1.length; _i++) {
            var member = prevMembers_1[_i];
            deadMembers.set(member.id(), member);
        }
        for (var _a = 0, currentMembers_1 = currentMembers; _a < currentMembers_1.length; _a++) {
            var member = currentMembers_1[_a];
            if (!deadMembers.delete(member.id())) {
                newMembers.push(member);
            }
        }
        var events = new Array(deadMembers.size + newMembers.length);
        var index = 0;
        // removal events should be added before added events
        deadMembers.forEach(function (member) {
            events[index++] = new MembershipEvent_1.MembershipEvent(member, MemberEvent.REMOVED, currentMembers);
            var connection = _this.connectionManager.getConnection(member.uuid);
            if (connection != null) {
                connection.close(null, new HazelcastError_1.TargetDisconnectedError('The client has closed the connection to this ' +
                    'member, after receiving a member left event from the cluster ' + connection));
            }
        });
        for (var _b = 0, newMembers_1 = newMembers; _b < newMembers_1.length; _b++) {
            var member = newMembers_1[_b];
            events[index++] = new MembershipEvent_1.MembershipEvent(member, MemberEvent.ADDED, currentMembers);
        }
        if (events.length !== 0) {
            if (this.memberListSnapshot.members.size !== 0) {
                this.logger.info('ClusterService', this.membersString(this.memberListSnapshot));
            }
        }
        return events;
    };
    ClusterService.prototype.createSnapshot = function (memberListVersion, memberInfos) {
        var newMembers = new Map();
        var newMemberList = new Array(memberInfos.length);
        var index = 0;
        for (var _i = 0, memberInfos_1 = memberInfos; _i < memberInfos_1.length; _i++) {
            var memberInfo = memberInfos_1[_i];
            var member = new Member_1.Member(memberInfo.address, memberInfo.uuid, memberInfo.attributes, memberInfo.liteMember, memberInfo.version);
            newMembers.set(memberInfo.uuid.toString(), member);
            newMemberList[index++] = member;
        }
        return new MemberListSnapshot(memberListVersion, newMembers, newMemberList);
    };
    ClusterService.prototype.membersString = function (snapshot) {
        var members = snapshot.memberList;
        var logString = '\n\nMembers [' + members.length + '] {';
        for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
            var member = members_1[_i];
            logString += '\n\t' + member.toString();
        }
        logString += '\n}\n';
        return logString;
    };
    ClusterService.prototype.getMemberList = function () {
        return this.memberListSnapshot.memberList;
    };
    return ClusterService;
}());
exports.ClusterService = ClusterService;
//# sourceMappingURL=ClusterService.js.map