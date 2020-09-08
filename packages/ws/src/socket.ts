import * as WebSocket from "ws";
import { childLog } from "shared/src/logger";
import { Cacher } from "shared/src/cache/cacher";
import { EntryEvent } from "hazelcast-client";
import { Order } from "shared/src/cache/factory/order";
import { WsRequestType, Env, WsResponseType } from "shared/src/enums";

export class Socket {
  log = childLog(Socket.name);
  id: string;
  socket: WebSocket;
  mapSubscriptions: WSS.MapSubscriptions = {};

  constructor(ws: WebSocket) {
    this.id = `${Math.random() * 100000000}`;
    this.socket = ws;

    this.socket.on("message", this.messageHandler);
    this.socket.on("close", this.onClose);
    this.socket.on("error", this.onError);
  }

  onClose = async (code: number, reason: string) => {
    this.log.warn("one connection closed", code, reason);
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
      this.log.info("clear listeners in map", mapName);
      const map = await Cacher.getMap(Env.Dev, mapName);
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
      const map = await Cacher.getMap(Env.Dev, req.map);
      const listenId = await map.addEntryListener(
        {
          added: this.onEntryAdded,
        },
        undefined,
        true
      );
      if (!this.mapSubscriptions[req.map]) {
        this.mapSubscriptions[req.map] = [];
      }
      this.mapSubscriptions[req.map].push(listenId);
      const values = await Cacher.getValues(Env.Dev, req.map, req.filter);
      this.send(WsResponseType.InitData, values);
    }
  };

  onEntryAdded = (evt: EntryEvent<string, Order>) => {
    const newValue = evt.value;
    this.log.info(newValue);
    this.send(WsResponseType.DeltaData, [newValue]);
  };

  send = (type: WsResponseType, data: any) => {
    this.socket.send(
      JSON.stringify({
        type,
        data,
      })
    );
  };
}
