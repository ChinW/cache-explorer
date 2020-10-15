
declare module Cache {
    interface DataType {
        toObject: () => {[key:string]: any}
    }

    interface CacheMap {
        name: string;
        typeConstructor: new () => import("../src/types/portableBase").PortableBase;
    }
}