import { FACTORY_ID, CACHE_TYPE_CLASS_ID } from "../cacheConstants";
import { Portable } from "@chiw/hazelcast-client/lib/serialization/Serializable";
import { BaseType } from "./base";

export class Order extends BaseType implements Portable, Cache.DataType {
  city: string = "";
  weather: string = "";

  toObject = () => {
    const obj: any = {};
    for(const key of Object.keys(this)) {
      // @ts-ignore
      if(typeof this[key] !== 'function') {
        // @ts-ignore
        obj[key] = this[key]; 
      }
    }
    return obj;
  };

  getFactoryId = (): number => {
    return FACTORY_ID;
  };

  getClassId = (): number => {
    return CACHE_TYPE_CLASS_ID.ORDER;
  };
}
