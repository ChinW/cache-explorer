import * as WebSocket from 'ws';
import _ from 'lodash';
import { childLog } from 'shared/src/logger';
import { Cache } from 'shared/src/cache/cache';
import { EntryEvent } from 'hazelcast-client';
import { Order } from 'shared/src/types/order';
import { WsRequestAction, Environment, WsResponseAction } from 'shared/src/enums';

export class Socket {
  log = childLog(Socket.name);
  id: string;
  socket: WebSocket;
  mapSubscriptions: StreamServer.MapSubscriptions = {};
  packageBuffer: StreamServer.DataTransaction = {
    add: {},
    update: {},
    remove: {}
  };
  cacheClient: Cache = null;
  throttledSend: (type: WsResponseAction, data: any) => void;

  constructor(incomingSocket: WebSocket) {
    this.id = `socket_${new Date().getTime()}`;
    this.socket = incomingSocket;
    this.throttledSend = _.throttle(this.send, 3000);

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
    this.log.info(req);
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
            added: (evt: EntryEvent<string, Order>) => this.onEntryChanged(evt, null, null),
            updated: (evt: EntryEvent<string, Order>) => this.onEntryChanged(null, evt, null),
            removed: (evt: EntryEvent<string, Order>) => this.onEntryChanged(null, null, evt)
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
    add?: EntryEvent<string, Order>,
    update?: EntryEvent<string, Order>,
    remove?: EntryEvent<string, Order>
  ) => {
    if (add) {
      this.packageBuffer.add[add.key] = add.value;
    }
    if (update) {
      this.packageBuffer.update[update.key] = update.value;
    }
    if (remove) {
      this.packageBuffer.remove[remove.key] = remove.oldValue;
    }
    this.throttledSend(WsResponseAction.DeltaData, {
      add: _.values(this.packageBuffer.add),
      update: _.values(this.packageBuffer.update),
      remove: _.values(this.packageBuffer.remove)
    });
  };

  send = (type: WsResponseAction, data: StreamServer.DataTransaction) => {
    this.socket.send(
      JSON.stringify({
        type,
        data
      })
    );
    this.packageBuffer = {
      add: {},
      update: {},
      remove: {}
    };
  };
}
