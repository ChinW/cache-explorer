/// <reference types="enum.d.ts" />

interface CacheQuery {
    env: Env;
    map: string;
    filter: string;
}

interface CacheType {
    toObject: () => {[key:string]: any}
}
