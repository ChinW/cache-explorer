import { Client } from '../types/client';
import { Order } from '../types/order';
import { CACHE_TYPE_CLASS_ID } from './cacheConstants';

export const CacheType: KV<CACHE_TYPE_CLASS_ID, Cache.CacheType> = {
  [CACHE_TYPE_CLASS_ID.ORDER]: {
    classId: CACHE_TYPE_CLASS_ID.ORDER,
    typeConstructor: Order
  },
  [CACHE_TYPE_CLASS_ID.CLIENT]: {
    classId: CACHE_TYPE_CLASS_ID.CLIENT,
    typeConstructor: Client
  },
}

export const CacheMap: {
  [key: string]: Cache.CacheMap
} = {
  Order: {
    name: "order",
    type: CacheType[CACHE_TYPE_CLASS_ID.ORDER]
  },
  Client: {
    name: "client",
    type: CacheType[CACHE_TYPE_CLASS_ID.CLIENT]
  },
};
