import { FACTORY_ID, CACHE_TYPE_CLASS_ID } from "./cacheConstants";
import { Portable } from "../../hazelcast-lib/serialization/Serializable";
import { PortableReader, PortableWriter } from "../../hazelcast-lib/serialization/portable/PortableSerializer";
import { BaseType } from "./base";

export class Order extends BaseType implements Portable, CacheType {
  city: string = "";
  weather: string = "";

  toObject = () => {
    const obj = {};
    for(const key of Object.keys(this)) {
      if(typeof this[key] !== 'function') {
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
