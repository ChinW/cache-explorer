import * as WebSocket from "ws";
import * as http from "http";
import { childLog } from "shared/src/logger";
import { Socket } from "./socket";

export class StreamServer {
  static port = 9998;
  server: WebSocket.Server;
  socketMap: {[key: string]: WebSocket};
  log = childLog(StreamServer.name);

  constructor() {
    this.initServer();
  }

  initServer = () => {
    this.server = new WebSocket.Server({
      port: StreamServer.port,
    });
    this.server.on("connection", this.onConnect);
    this.log.info("Cache stream server started at port %d", StreamServer.port);
  };

  onConnect = (socket: any, request: http.IncomingMessage) => {
    this.log.info("Received a connection");
    new Socket(socket);
  };
}