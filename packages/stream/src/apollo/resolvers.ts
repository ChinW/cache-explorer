import { Cache } from 'shared/src/cache/cache';
import { Environment } from 'shared/src/enums';
import { CacheMap } from 'shared/src/types/cacheMap';
import { Order } from 'shared/src/types/order';

const cacheClient = new Cache(Environment.DEV);

export const resolvers = {
  Query: {
    orders: async (): Promise<Array<Order>> => {
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
    updateOrder: async (parent, args, context, info): Promise<Order> => {
      const order = new Order();
      order.fromObject(args.order);
      const result = await cacheClient.setValue(CacheMap.Order, order.id, order);
      return result as Order;
    }
  }
};
