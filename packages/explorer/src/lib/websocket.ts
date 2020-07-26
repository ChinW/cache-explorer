import { Env } from "shared/src/constants";

type OnMessageCallback = (data: any[]) => void;

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
          const result = JSON.parse(evt.data);
          for (const cb of this.onMessageListeners) {
            cb(result);
          }
        });
        resolve(0);
      });
    })
    
  }

  subscribeMap = (env: Env, map: string, filter: string) => {
    if (this.socket) {
      this.socket.send(
        JSON.stringify({
          map,
          filter,
          action: "Subscribe",
          env: env.toString(),
        })
      );
    }
  };

  close = () => {
    console.log("close ws connection");
    this.socket.close();
  };

  subscribeOnMessage = (cb: OnMessageCallback) => {
    this.onMessageListeners.push(cb);
  };
}
