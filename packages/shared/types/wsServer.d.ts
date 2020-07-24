/// <reference types="./enum.ts" />

declare namespace WsServer {
    interface Request {
        map: string;
        action: Action;
        filter: string;
    }

    interface Response {
        data: any;
    }

    interface MapSubscriptions {
        [map: string]: string[]
    }
}