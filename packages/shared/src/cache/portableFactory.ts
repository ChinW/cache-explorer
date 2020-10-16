import { FACTORY_ID } from "./cacheConstants";
import { PortableFactory, Portable } from "hazelcast-client";
import { CacheType } from "./cacheMap";

export const CachePortableFactory: PortableFactory = (classId: number): Portable => {
  const type = CacheType[classId].typeConstructor;
  return type ? new type() : null;
};

export const PORTABLE_FACTORIES: { [key: string]: PortableFactory } = {
  [FACTORY_ID]: CachePortableFactory
};