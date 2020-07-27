import { Env, WsRequestType } from "shared/src/enums";

type OnMessageCallback = (data: WSS.Response) => void;

export class Ws {
  socket: WebSocket;
  onMessageListeners: Array<OnMessageCallback> = [];

  constructor() {
    this.socket = new WebSocket("ws://localhost:9999");
  }

  init = async () => {
    return new Promise((resolve) => {
      this.socket.addEventListener("open", (event: Event) => {
        this.socket.addEventListener("message", (evt: MessageEvent) => {
          const result: WSS.Response = JSON.parse(evt.data);
          for (const cb of this.onMessageListeners) {
            cb(result);
          }
        });
        resolve(0);
      });
    });
  };

  subscribeMap = (map: string, filter: string) => {
    if (this.socket && map.length > 0) {
      this.send({
        map,
        filter,
        action: WsRequestType.Subscribe,
      });
    }
  };

  send = (request: WSS.Request) => {
    this.socket.send(JSON.stringify(request));
  };

  close = () => {
    console.log("close ws connection");
    this.socket.close();
  };

  subscribeOnMessage = (cb: OnMessageCallback) => {
    this.onMessageListeners.push(cb);
  };
}
