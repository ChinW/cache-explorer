import { Client } from '../types/client';
import { Order } from '../types/order';
import { CACHE_TYPE_CLASS_ID } from './cacheConstants';

export const CacheMap: {
  [key: string]: Cache.CacheMap
} = {
  [CACHE_TYPE_CLASS_ID.ORDER]: {
    name: "order",
    typeConstructor: Order
  },
  [CACHE_TYPE_CLASS_ID.CLIENT]: {
    name: "client",
    typeConstructor: Client
  },
};
