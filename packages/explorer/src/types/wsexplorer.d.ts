/// <reference path="./node_modules/shared/types/wss.d.ts" />

declare namespace WsExplorer {
  interface Column {
    headerName: string;
    field: string;
  }

  interface Props {
    request?: WSS.Request;
    response?: WSS.Response;
    data: Array<any>;
  }
}
