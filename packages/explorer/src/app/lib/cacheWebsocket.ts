import { Environment, WsRequestAction } from 'shared/src/enums';

type OnMessageCallback = (data: StreamServer.Response) => void;

export class CacheWebsocket {
  socket?: WebSocket = undefined;
  socketState = WebSocket.CLOSED;
  onMessageListeners: Array<OnMessageCallback> = [];

  constructor() {
    console.log('Created webscoket');
  }

  init = async (env: Environment) => {
    this.socket = new WebSocket('ws://0.0.0.0:9999');
    this.socketState = WebSocket.OPEN;
    return new Promise((resolve) => {
      this.socket!!.addEventListener('open', (event: Event) => {
        console.log('this.socketState', this.socketState)
        this.send({
          action: WsRequestAction.Init,
          env
        });
        this.socket!!.addEventListener('message', (evt: MessageEvent) => {
          const result: StreamServer.Response = JSON.parse(evt.data);
          for (const callback of this.onMessageListeners) {
            callback(result);
          }
        });
        resolve(0);
      });
    });
  };

  subscribeMap = (cacheMap: string, filter: string) => {
    if (this.socket && cacheMap.length > 0) {
      this.send({
        action: WsRequestAction.Subscribe,
        cacheMap,
        filter
      });
    }
  };

  send = (request: StreamServer.Request) => {
    this.socket!!.send(JSON.stringify(request));
  };

  close = () => {
    console.log('close ws connection');
    this.socket!!.close();
    this.socketState = WebSocket.CLOSED;
  };

  subscribeOnMessage = (cb: OnMessageCallback) => {
    this.onMessageListeners.push(cb);
  };
}
