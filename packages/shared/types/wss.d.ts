declare namespace WSS {
  interface Request {
    action: import("../src/enums").WsRequestType;
    map: string;
    filter: string;
  }

  interface Response {
    type: import("../src/enums").WsResponseType;
    data: any;
  }

  interface MapSubscriptions {
    [map: string]: string[];
  }
}
