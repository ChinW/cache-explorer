import { Order } from "./order";
import { FACTORY_ID, CACHE_TYPE_CLASS_ID } from "../cacheConstants";
import { PortableFactory, Portable } from "hazelcast-client";
import { Client } from "./client";

const CLASS_ID_TO_TYPE = {
  [CACHE_TYPE_CLASS_ID.ORDER]: Order,
  [CACHE_TYPE_CLASS_ID.CLIENT]: Client,
};

export const CachePortableFactory: PortableFactory = (classId: number): Portable => {
  return CLASS_ID_TO_TYPE[classId] ? new CLASS_ID_TO_TYPE[classId]() : null;
};

export const PORTABLE_FACTORIES: { [key: string]: PortableFactory } = {
  [FACTORY_ID]: CachePortableFactory
};