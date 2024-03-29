import * as WebSocket from 'ws';
import _ from 'lodash';
import { childLog } from 'shared/src/logger';
import { Cache } from 'shared/src/cache/cache';
import { EntryEvent } from 'hazelcast-client';
import { WsRequestAction, Environment, WsResponseAction } from 'shared/src/enums';
import { PortableBase } from 'shared/src/types/portableBase';

type PackageBuffer = {
  [key: string]: {
    type: 'add' | 'update' | 'remove';
    value: PortableBase;
  };
};

export class Socket {
  log = childLog(Socket.name);
  id: string;
  socket: WebSocket;
  mapSubscriptions: StreamServer.MapSubscriptions = {};
  packageBuffer: PackageBuffer = {};
  cacheClient: Cache = null;
  throttledSend: (data: PackageBuffer) => void;

  constructor(incomingSocket: WebSocket) {
    this.id = `socket_${new Date().getTime()}`;
    this.socket = incomingSocket;
    this.throttledSend = _.throttle(this.sendInBatch, 1500);

    this.socket.on('message', this.onMessage);
    this.socket.on('close', this.onClose);
    this.socket.on('error', this.onError);
  }

  clearAllListeners = async () => {
    for (const map in this.mapSubscriptions) {
      await this.clearMapListeners(map);
    }
  };

  clearMapListeners = async (cacheMap: string) => {
    const listenIds = this.mapSubscriptions[cacheMap];
    if (listenIds && listenIds.length > 0) {
      this.log.info('Clear listeners in cache map', cacheMap);
      const map = await this.cacheClient.getMap(cacheMap);
      for (const id of listenIds) {
        await map.removeEntryListener(id);
      }
    }
    this.mapSubscriptions[cacheMap] = [];
  };

  onClose = async (code: number, reason: string) => {
    this.log.warn('One connection closed', code, reason);
    await this.clearAllListeners();
  };

  onError = async (err: Error) => {
    this.log.error(err);
    await this.clearAllListeners();
  };

  onMessage = async (message: WebSocket.Data) => {
    let req = JSON.parse(message as string) as StreamServer.Request;
    switch (req.action) {
      case WsRequestAction.Init: {
        this.cacheClient = new Cache(req.env);
        break;
      }
      case WsRequestAction.Subscribe: {
        this.log.info(req);
        this.clearAllListeners();
        const map = await this.cacheClient.getMap(req.cacheMap);
        const listenId = await map.addEntryListener(
          {
            added: (evt: EntryEvent<string, PortableBase>) => this.onEntryChanged(evt, null, null),
            updated: (evt: EntryEvent<string, PortableBase>) => this.onEntryChanged(null, evt, null),
            removed: (evt: EntryEvent<string, PortableBase>) => this.onEntryChanged(null, null, evt)
          },
          undefined,
          true
        );
        if (!this.mapSubscriptions[req.cacheMap]) {
          this.mapSubscriptions[req.cacheMap] = [];
        }
        this.mapSubscriptions[req.cacheMap].push(listenId);
        const values = await this.cacheClient.getValues(req.cacheMap, req.filter);
        this.send(WsResponseAction.InitData, {
          add: values,
          update: [],
          remove: []
        });
        break;
      }
    }
  };

  onEntryChanged = (
    add?: EntryEvent<string, PortableBase>,
    update?: EntryEvent<string, PortableBase>,
    remove?: EntryEvent<string, PortableBase>
  ) => {
    if (add) {
      this.packageBuffer[add.key] = {
        type: 'add',
        value: add.value
      };
    }
    if (update) {
      this.packageBuffer[update.key] = {
        type: 'update',
        value: update.value
      };
    }
    if (remove) {
      this.packageBuffer[remove.key] = {
        type: 'remove',
        value: remove.value
      };
    }
    this.throttledSend(this.packageBuffer);
  };

  sendInBatch = (data: PackageBuffer) => {
    const payload: {
      add: PortableBase[];
      update: PortableBase[];
      remove: PortableBase[];
    } = {
      add: [],
      update: [],
      remove: []
    };
    for (const item of _.values(data)) {
      payload[item.type].push(item.value);
    }
    this.send(WsResponseAction.DeltaData, payload);
  };

  send = (
    type: WsResponseAction,
    data: {
      add: PortableBase[];
      update: PortableBase[];
      remove: PortableBase[];
    }
  ) => {
    this.socket.send(
      JSON.stringify({
        type,
        data: {
          add: data.add.map((i) => i.toObject()),
          update: data.update.map((i) => i.toObject()),
          remove: data.remove.map((i) => i.toObject())
        }
      })
    );
    this.packageBuffer = {};
  };
}
