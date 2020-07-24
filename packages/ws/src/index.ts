import { WsServer, test } from './wsServer';

export const start = () => {
  const server = new WsServer();
  test();
};

start();
