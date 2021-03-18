/// <reference path="shared/types/streamServer.d.ts" />

declare namespace Benchmark {
  interface Column {
    headerName: string;
    field: string;
  }

  interface Props {
    websocket: import("app/lib/cacheWebsocket.ts").CacheWebsocket;
    data: Metric[];
    chart: {
      cost?: import('@antv/g2').Chart,
      line?: import('@antv/g2').Chart,
      [key: name]: import('@antv/g2').Chart
    };
  }

  interface StateAction {
    type: "initData" | "setChart",
    data: any
  }

  interface Metric {
    createdAt: number;
    timeCost: number;
    positionPct?: number;
    wrapItems?: number;
  }
}
