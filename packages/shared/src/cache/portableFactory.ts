import { Order } from "../types/order";
import { FACTORY_ID, CACHE_TYPE_CLASS_ID } from "./cacheConstants";
import { PortableFactory, Portable } from "hazelcast-client";
import { Client } from "../types/client";

const CLASS_ID_TO_TYPE = {
  [CACHE_TYPE_CLASS_ID.ORDER.toFixed(0)]: Order,
  [CACHE_TYPE_CLASS_ID.CLIENT.toFixed(0)]: Client,
};

export const CachePortableFactory: PortableFactory = (classId: number): Portable => {
  const type = CLASS_ID_TO_TYPE[classId];
  return type ? new type() : null;
};

export const PORTABLE_FACTORIES: { [key: string]: PortableFactory } = {
  [FACTORY_ID]: CachePortableFactory
};