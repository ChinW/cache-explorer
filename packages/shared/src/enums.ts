
export enum Env {
    Prod = "prod",
    QA = "qa",
    Dev = "dev"
}

export enum WsResponseType {
    InitData = "InitData",
    DeltaData = "DeltaData",
    Notificaiton = "Notification"
}

export enum WsRequestType {
    None = "None",
    Subscribe = "Subscribe",
    Query = "Query"
}
