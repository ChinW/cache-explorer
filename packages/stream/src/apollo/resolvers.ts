import { GraphQLScalarType, Kind } from 'graphql';
import { Cache } from 'shared/src/cache/cache';
import { Environment } from 'shared/src/enums';
import { CacheMap } from 'shared/src/types/cacheMap';
import { Order } from 'shared/src/types/order';
import { log } from 'shared/src/logger';
import { PortableBase } from 'shared/src/types/portableBase';

const cacheClient = new Cache(Environment.DEV);

export const resolvers = {
  Query: {
    orders: async (): Promise<Array<PortableBase>> => {
      try {
        const result = await cacheClient.getValues(CacheMap.Order, '');
        return result;
      } catch (e) {
        console.log('error', e);
        return [];
      }
    }
  },
  Mutation: {
    updateOrder: async (
      parent: any,
      args: {
        key: string;
        update: {
          [key: string]: any;
        };
      }
    ): Promise<Order> => {
      const result = await cacheClient.update(CacheMap.Order, args.key, args.update);
      return result as Order;
    },
    createOrder: async (
      parent: any,
      args: {
        key: string;
        values: {
          [key: string]: any;
        };
      }
    ): Promise<Order> => {
      const order = new Order()
      order.id = args.key
      order.acceptUpdate(args.values)
      const result = await cacheClient.put(CacheMap.Order, args.key, order);
      return result as Order;
    }
  }
};
