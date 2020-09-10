import * as WebSocket from 'ws';
import _ from 'lodash';
import { childLog } from 'shared/src/logger';
import { Cache } from 'shared/src/cache/cache';
import { EntryEvent } from 'hazelcast-client';
import { Order } from 'shared/src/types/order';
import { WsRequestType, Env, WsResponseType } from 'shared/src/enums';

export class Socket {
  log = childLog(Socket.name);
  id: string;
  socket: WebSocket;
  mapSubscriptions: WSS.MapSubscriptions = {};
  packageBuffer: WSS.ResponseDataTransaction = {
    add: {},
    update: {},
    remove: {}
  };
  throttledSend: (type: WsResponseType, data: any) => void;

  constructor(ws: WebSocket) {
    this.id = `${Math.random() * 100000000}`;
    this.socket = ws;
    this.throttledSend = _.throttle(this.send, 3000);

    this.socket.on('message', this.messageHandler);
    this.socket.on('close', this.onClose);
    this.socket.on('error', this.onError);
  }

  onClose = async (code: number, reason: string) => {
    this.log.warn('one connection closed', code, reason);
    await this.clearAllListeners();
  };

  onError = async (err: Error) => {
    this.log.error(err);
    await this.clearAllListeners();
  };

  clearAllListeners = async () => {
    for (const map in this.mapSubscriptions) {
      await this.clearMapListeners(map);
    }
  };

  clearMapListeners = async (mapName: string) => {
    const listenIds = this.mapSubscriptions[mapName];
    if (listenIds && listenIds.length > 0) {
      this.log.info('clear listeners in map', mapName);
      const map = await Cache.getMap(Env.Dev, mapName);
      for (const id of listenIds) {
        await map.removeEntryListener(id);
      }
    }
    this.mapSubscriptions[mapName] = [];
  };

  messageHandler = async (message: WebSocket.Data) => {
    let req = JSON.parse(message as string) as WSS.Request;
    this.log.info(req);
    if (req.action === WsRequestType.Subscribe) {
      this.log.info(req);
      this.clearAllListeners();
      const map = await Cache.getMap(Env.Dev, req.map);
      const listenId = await map.addEntryListener(
        {
          added: (evt: EntryEvent<string, Order>) => this.onEntryChanged(evt, null, null),
          updated: (evt: EntryEvent<string, Order>) => this.onEntryChanged(null, evt, null),
          removed: (evt: EntryEvent<string, Order>) => this.onEntryChanged(null, null, evt)
        },
        undefined,
        true
      );
      if (!this.mapSubscriptions[req.map]) {
        this.mapSubscriptions[req.map] = [];
      }
      this.mapSubscriptions[req.map].push(listenId);
      const values = await Cache.getValues(Env.Dev, req.map, req.filter);
      this.send(WsResponseType.InitData, {
        add: values,
        update: [],
        remove: []
      });
    }
  };

  onEntryChanged = (
    add?: EntryEvent<string, Order>,
    update?: EntryEvent<string, Order>,
    remove?: EntryEvent<string, Order>
  ) => {
    if(add) {
      this.packageBuffer.add[add.key] = add.value;
    }
    if(update) {
      this.packageBuffer.update[update.key] = update.value;
    }
    if(remove) {
      this.packageBuffer.remove[remove.key] = remove.oldValue;
    }
    this.throttledSend(WsResponseType.DeltaData, {
      add: _.values(this.packageBuffer.add),
      update: _.values(this.packageBuffer.update),
      remove: _.values(this.packageBuffer.remove)
    });
  };

  send = (type: WsResponseType, data: WSS.ResponseDataTransaction) => {
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
