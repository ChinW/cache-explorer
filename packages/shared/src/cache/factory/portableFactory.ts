import { Order } from "./order";
import { Portable, PortableFactory } from "@chiw/hazelcast-client/lib/serialization/Serializable";
import { CACHE_TYPE_CLASS_ID } from "../cacheConstants";

const CLASS_ID_TO_TYPE = {
  [CACHE_TYPE_CLASS_ID.ORDER]: Order,
};

export class CachePortableFactory implements PortableFactory {
  create = (classId: number): Portable => {
    return CLASS_ID_TO_TYPE[classId] ? new CLASS_ID_TO_TYPE[classId]() : null;
  };
}
