declare namespace WSS {
  interface Request {
    action: import("../src/enums").WsRequestType;
    map: string;
    filter: string;
  }

  interface ResponseDataTransaction {
      add: {
        [key: string]: any
      };
      update: {
        [key: string]: any
      };
      remove: {
        [key: string]: any
      };
  }

  interface Response {
    type: import("../src/enums").WsResponseType;
    data: {
      add: any[],
      update: any[],
      remove: any[],
    };
  }

  interface MapSubscriptions {
    [map: string]: string[];
  }
}
