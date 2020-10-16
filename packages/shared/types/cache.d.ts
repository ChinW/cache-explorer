
declare module Cache {
    interface DataType {
        toObject: () => {[key:string]: any}
    }

    interface CacheType {
        classId: number;
        typeConstructor: new () => import("../src/types/portableBase").PortableBase;
    }

    interface CacheMap {
        name: string;
        type: CacheType;
    }
}