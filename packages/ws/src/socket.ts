import * as WebSocket from "ws";
import { childLog } from "shared/src/logger";
import { HazelcastUtils } from "shared/src/hazelcastUtils";
import { EntryEvent } from "@chiw/hazelcast-client";
import { Order } from "shared/src/cacheFactory/order";
import { Action, Env } from "shared/types/enum";

export class Socket {
  log = childLog(Socket.name);
  id: string;
  socket: WebSocket;
  mapSubscriptions: WsServer.MapSubscriptions = {};

  constructor(ws: WebSocket) {
    this.id = `${Math.random() * 100000000}`;
    this.socket = ws;

    this.socket.on("message", async (message: WebSocket.Data) => {
      const result = await this.messageHandler(message);
      if (result) {
        const response: WsServer.Response = {
          data: result,
        };
        this.socket.send(JSON.stringify(response));
      }
    });

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
      const map = await HazelcastUtils.getMap(Env.Dev, mapName);
      for (const id of listenIds) {
        await map.removeEntryListener(id);
      }
    }
    this.mapSubscriptions[mapName] = [];
  };

  messageHandler = async (
    message: WebSocket.Data
  ): Promise<Array<any> | { [key: string]: any } | string | number | null> => {
    let req = JSON.parse(message as string) as WsServer.Request;
    this.log.info(req);
    if (req.action === Action.Subscribe) {
      this.log.info("subscribe", req);
      const query: CacheQuery = {
        env: "dev",
        map: req.map,
        filter: req.filter,
      };
      this.clearAllListeners();
      // this.clearMapListeners(query.map);
      const map = await HazelcastUtils.getMap(Env.Dev, query.map);
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
      const values = await HazelcastUtils.getValues(query);
      this.send(values);
    }
    return null;
  };

  onEntryAdded = (evt: EntryEvent<string, Order>) => {
    const newValue = evt.value;
    this.log.info(newValue);
    this.send([newValue]);
  };

  send = (data: any) => {
    this.socket.send(JSON.stringify(data));
  };
}
