
export enum Environment {
    PROD = "prod",
    QA = "qa",
    DEV = "dev"
}

export enum WsRequestAction {
    None = "none",
    Init = "init",
    Subscribe = "subscribe"
}

export enum WsResponseAction {
    InitData = "initData",
    DeltaData = "delta",
    Notificaiton = "notification"
}