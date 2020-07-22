/// <reference types="next" />
/// <reference types="next/types/global" />

type Env = "prod" | "qa" | "dev";

interface CacheQuery {
    env: Env;
    map: string;
    filter: string;
}

interface CacheType {
    toObject: () => {[key:string]: any}
}
