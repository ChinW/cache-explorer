import * as WebSocket from "ws";
import * as http from "http";
import { childLog } from "shared/src/logger";
import { Socket } from "./socket";

export class WsServer {
  static port = 9999;
  wss: WebSocket.Server;
  socketList: {[key: string]: WebSocket};
  log = childLog(WsServer.name);

  constructor() {
    this.initServer();
  }

  initServer = () => {
    this.wss = new WebSocket.Server({
      port: WsServer.port,
    });
    this.wss.on("connection", this.onConnect);
    this.log.info("websocket server started at port", WsServer.port);
  };

  onConnect = (socket: any, request: http.IncomingMessage) => {
    this.log.info("Received a connection ");
    new Socket(socket);
  };
}