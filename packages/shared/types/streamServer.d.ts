declare namespace StreamServer {
  interface InitRequest {
    action: import('../src/enums').WsRequestAction.Init;
    env: import('../src/enums').Environment;
  }

  interface SubscribeRequest {
    action: import('../src/enums').WsRequestAction.Subscribe;
    cacheMap: string;
    filter: string;
  }

  type Request = InitRequest | SubscribeRequest;

  interface DataTransaction {
    add: {
      [key: string]: import('../src/types/portableBase').PortableBase;
    };
    update: {
      [key: string]: import('../src/types/portableBase').PortableBase;
    };
    remove: {
      [key: string]: import('../src/types/portableBase').PortableBase;
    };
  }

  interface Response {
    type: import('../src/enums').WsResponseAction;
    data: {
      add: any[];
      update: any[];
      remove: any[];
    };
  }

  interface MapSubscriptions {
    [map: string]: string[];
  }
}
