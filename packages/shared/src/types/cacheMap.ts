import { Client } from './client';
import { Order } from './order';

export enum CacheType {
  ORDER = "order",
  CLIENT = "client"
}

export const CacheMap: {
  [key in keyof typeof CacheType]?: Cache.CacheMap
} = {
  ORDER: {
    name: CacheType.ORDER,
    typeConstructor: Order
  },
  CLIENT: {
    name: CacheType.CLIENT,
    typeConstructor: Client
  }
};
