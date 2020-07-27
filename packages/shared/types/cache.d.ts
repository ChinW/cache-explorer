
declare module Cache {
    interface DataType {
        toObject: () => {[key:string]: any}
    }
}