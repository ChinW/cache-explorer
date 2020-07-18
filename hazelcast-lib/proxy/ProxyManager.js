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
var ClientAddDistributedObjectListenerCodec_1 = require("../codec/ClientAddDistributedObjectListenerCodec");
var ClientCreateProxyCodec_1 = require("../codec/ClientCreateProxyCodec");
var ClientDestroyProxyCodec_1 = require("../codec/ClientDestroyProxyCodec");
var ClientRemoveDistributedObjectListenerCodec_1 = require("../codec/ClientRemoveDistributedObjectListenerCodec");
var InvocationService_1 = require("../invocation/InvocationService");
var FlakeIdGeneratorProxy_1 = require("./FlakeIdGeneratorProxy");
var ListProxy_1 = require("./ListProxy");
var MapProxy_1 = require("./MapProxy");
var MultiMapProxy_1 = require("./MultiMapProxy");
var NearCachedMapProxy_1 = require("./NearCachedMapProxy");
var PNCounterProxy_1 = require("./PNCounterProxy");
var QueueProxy_1 = require("./QueueProxy");
var ReplicatedMapProxy_1 = require("./ReplicatedMapProxy");
var RingbufferProxy_1 = require("./ringbuffer/RingbufferProxy");
var SetProxy_1 = require("./SetProxy");
var ReliableTopicProxy_1 = require("./topic/ReliableTopicProxy");
var DistributedObjectListener_1 = require("../core/DistributedObjectListener");
var Util_1 = require("../Util");
var ClientCreateProxiesCodec_1 = require("../codec/ClientCreateProxiesCodec");
exports.NAMESPACE_SEPARATOR = '/';
var RINGBUFFER_PREFIX = '_hz_rb_';
var ProxyManager = /** @class */ (function () {
    function ProxyManager(client) {
        this.service = {};
        this.proxies = new Map();
        this.client = client;
        this.logger = this.client.getLoggingService().getLogger();
        this.invocationTimeoutMillis = this.client.getInvocationService().getInvocationTimeoutMillis();
        this.invocationRetryPauseMillis = this.client.getInvocationService().getInvocationRetryPauseMillis();
    }
    ProxyManager.prototype.init = function () {
        this.service[ProxyManager.MAP_SERVICE] = MapProxy_1.MapProxy;
        this.service[ProxyManager.SET_SERVICE] = SetProxy_1.SetProxy;
        this.service[ProxyManager.QUEUE_SERVICE] = QueueProxy_1.QueueProxy;
        this.service[ProxyManager.LIST_SERVICE] = ListProxy_1.ListProxy;
        this.service[ProxyManager.MULTIMAP_SERVICE] = MultiMapProxy_1.MultiMapProxy;
        this.service[ProxyManager.RINGBUFFER_SERVICE] = RingbufferProxy_1.RingbufferProxy;
        this.service[ProxyManager.REPLICATEDMAP_SERVICE] = ReplicatedMapProxy_1.ReplicatedMapProxy;
        this.service[ProxyManager.FLAKEID_SERVICE] = FlakeIdGeneratorProxy_1.FlakeIdGeneratorProxy;
        this.service[ProxyManager.PNCOUNTER_SERVICE] = PNCounterProxy_1.PNCounterProxy;
        this.service[ProxyManager.RELIABLETOPIC_SERVICE] = ReliableTopicProxy_1.ReliableTopicProxy;
    };
    ProxyManager.prototype.getOrCreateProxy = function (name, serviceName, createAtServer) {
        var _this = this;
        if (createAtServer === void 0) { createAtServer = true; }
        var fullName = serviceName + exports.NAMESPACE_SEPARATOR + name;
        if (this.proxies.has(fullName)) {
            return this.proxies.get(fullName);
        }
        var deferred = Util_1.DeferredPromise();
        this.proxies.set(fullName, deferred.promise);
        var createProxyPromise;
        if (createAtServer) {
            createProxyPromise = this.createProxy(name, serviceName);
        }
        else {
            createProxyPromise = Promise.resolve();
        }
        createProxyPromise
            .then(function () {
            return _this.initializeLocalProxy(name, serviceName, createAtServer);
        })
            .then(function (localProxy) {
            deferred.resolve(localProxy);
        })
            .catch(function (error) {
            _this.proxies.delete(fullName);
            deferred.reject(error);
        });
        return deferred.promise;
    };
    ProxyManager.prototype.createDistributedObjectsOnCluster = function () {
        var proxyEntries = new Array(this.proxies.size);
        var index = 0;
        this.proxies.forEach(function (_, namespace) {
            var separatorIndex = namespace.indexOf(exports.NAMESPACE_SEPARATOR);
            var serviceName = namespace.substring(0, separatorIndex);
            var name = namespace.substring(separatorIndex + 1);
            proxyEntries[index++] = [name, serviceName];
        });
        if (proxyEntries.length === 0) {
            return Promise.resolve();
        }
        var request = ClientCreateProxiesCodec_1.ClientCreateProxiesCodec.encodeRequest(proxyEntries);
        request.setPartitionId(-1);
        var invocation = new InvocationService_1.Invocation(this.client, request);
        return this.client.getInvocationService()
            .invokeUrgent(invocation)
            .then(function () { return undefined; });
    };
    ProxyManager.prototype.getDistributedObjects = function () {
        var promises = new Array(this.proxies.size);
        var index = 0;
        this.proxies.forEach(function (proxy) {
            promises[index++] = proxy;
        });
        return Promise.all(promises);
    };
    ProxyManager.prototype.destroyProxy = function (name, serviceName) {
        this.proxies.delete(serviceName + exports.NAMESPACE_SEPARATOR + name);
        var clientMessage = ClientDestroyProxyCodec_1.ClientDestroyProxyCodec.encodeRequest(name, serviceName);
        clientMessage.setPartitionId(-1);
        return this.client.getInvocationService().invokeOnRandomTarget(clientMessage)
            .then(function () { return undefined; });
    };
    ProxyManager.prototype.destroyProxyLocally = function (namespace) {
        var proxy = this.proxies.get(namespace);
        if (proxy != null) {
            this.proxies.delete(namespace);
            return proxy.then(function (distributedObject) {
                return distributedObject.destroyLocally();
            });
        }
        return Promise.resolve();
    };
    ProxyManager.prototype.addDistributedObjectListener = function (distributedObjectListener) {
        var handler = function (clientMessage) {
            var converterFunc = function (objectName, serviceName, eventType) {
                eventType = eventType.toLowerCase();
                var distributedObjectEvent = new DistributedObjectListener_1.DistributedObjectEvent(eventType, serviceName, objectName);
                distributedObjectListener(distributedObjectEvent);
            };
            ClientAddDistributedObjectListenerCodec_1.ClientAddDistributedObjectListenerCodec.handle(clientMessage, converterFunc);
        };
        var codec = this.createDistributedObjectListener();
        return this.client.getListenerService().registerListener(codec, handler);
    };
    ProxyManager.prototype.removeDistributedObjectListener = function (listenerId) {
        return this.client.getListenerService().deregisterListener(listenerId);
    };
    ProxyManager.prototype.destroy = function () {
        this.proxies.clear();
    };
    ProxyManager.prototype.createProxy = function (name, serviceName) {
        var request = ClientCreateProxyCodec_1.ClientCreateProxyCodec.encodeRequest(name, serviceName);
        return this.client.getInvocationService().invokeOnRandomTarget(request);
    };
    ProxyManager.prototype.createDistributedObjectListener = function () {
        return {
            encodeAddRequest: function (localOnly) {
                return ClientAddDistributedObjectListenerCodec_1.ClientAddDistributedObjectListenerCodec.encodeRequest(localOnly);
            },
            decodeAddResponse: function (msg) {
                return ClientAddDistributedObjectListenerCodec_1.ClientAddDistributedObjectListenerCodec.decodeResponse(msg).response;
            },
            encodeRemoveRequest: function (listenerId) {
                return ClientRemoveDistributedObjectListenerCodec_1.ClientRemoveDistributedObjectListenerCodec.encodeRequest(listenerId);
            },
        };
    };
    ProxyManager.prototype.initializeLocalProxy = function (name, serviceName, createAtServer) {
        var localProxy;
        if (serviceName === ProxyManager.MAP_SERVICE && this.client.getConfig().getNearCacheConfig(name)) {
            localProxy = new NearCachedMapProxy_1.NearCachedMapProxy(this.client, serviceName, name);
        }
        else {
            // This call may throw ClientOfflineError for partition specific proxies with async start
            localProxy = new this.service[serviceName](this.client, serviceName, name);
        }
        if (serviceName === ProxyManager.RELIABLETOPIC_SERVICE) {
            return this.getOrCreateProxy(RINGBUFFER_PREFIX + name, ProxyManager.RINGBUFFER_SERVICE, createAtServer)
                .then(function (ringbuffer) {
                localProxy.setRingbuffer(ringbuffer);
                return localProxy;
            });
        }
        else {
            return Promise.resolve(localProxy);
        }
    };
    ProxyManager.MAP_SERVICE = 'hz:impl:mapService';
    ProxyManager.SET_SERVICE = 'hz:impl:setService';
    ProxyManager.LOCK_SERVICE = 'hz:impl:lockService';
    ProxyManager.QUEUE_SERVICE = 'hz:impl:queueService';
    ProxyManager.LIST_SERVICE = 'hz:impl:listService';
    ProxyManager.MULTIMAP_SERVICE = 'hz:impl:multiMapService';
    ProxyManager.RINGBUFFER_SERVICE = 'hz:impl:ringbufferService';
    ProxyManager.REPLICATEDMAP_SERVICE = 'hz:impl:replicatedMapService';
    ProxyManager.FLAKEID_SERVICE = 'hz:impl:flakeIdGeneratorService';
    ProxyManager.PNCOUNTER_SERVICE = 'hz:impl:PNCounterService';
    ProxyManager.RELIABLETOPIC_SERVICE = 'hz:impl:reliableTopicService';
    return ProxyManager;
}());
exports.ProxyManager = ProxyManager;
//# sourceMappingURL=ProxyManager.js.map