/// <reference path="shared/types/streamServer.d.ts" />

declare namespace Explorer {
  interface Column {
    headerName: string;
    field: string;
  }

  interface Props {
    response?: StreamServer.Response;
    websocket: import("app/lib/cacheWebsocket.ts").CacheWebsocket;
  }
}
