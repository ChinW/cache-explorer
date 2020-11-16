/// <reference path="shared/types/streamServer.d.ts" />

declare namespace Benchmark {
  interface Column {
    headerName: string;
    field: string;
  }

  interface Props {
    websocket: import("app/lib/cacheWebsocket.ts").CacheWebsocket;
    data: import('shared/src/types/portableBase').PortableBase[];
    chart?: import('@antv/g2').Chart;
  }

  interface StateAction {
    type: "initData" | "setChart",
    data: any
  }
}
