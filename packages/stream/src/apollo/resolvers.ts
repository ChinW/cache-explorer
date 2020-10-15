import { Cache } from 'shared/src/cache/cache';
import { Environment } from 'shared/src/enums';
import { CacheMap } from 'shared/src/types/cacheMap';
import { Order } from 'shared/src/types/order';
import { log } from 'shared/src/logger';
import { PortableBase } from 'shared/src/types/portableBase';

const cacheClient = new Cache(Environment.DEV);

const createOrders = async (items: Dict[]): Promise<PortableBase[]> => {
  const orders: PortableBase[] = [];
  for (const item of items) {
    const order = new Order();
    order.acceptUpdate(item);
    order.generateKey();
    orders.push(order);
  }
  const result = await cacheClient.putAll(CacheMap.Order, orders);
  return result;
};

export const resolvers = {
  Query: {
    orders: async (): Promise<PortableBase[]> => {
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
    putOrders: async (
      parent: any,
      args: {
        items: Dict[];
      }
    ): Promise<PortableBase[]> => {
      return await createOrders(args.items);
    },
    updateOrders: async (
      parent: any,
      args: {
        pairs: KVPair<string, Dict>[];
        // createIfAbsent: boolean;
      }
    ): Promise<{
      success: PortableBase[],
      failure: Dict[]
    }> => {
      const { pairs } = args;
      const updates: KV<String, Dict> = {};
      for (const pair of pairs) {
        updates[pair.key] = pair.value;
      }
      let result = await cacheClient.updateAll(CacheMap.Order, updates);
      // if (result.failure.length > 0 && createIfAbsent) {
      //   const payload = pairs.map((pair) => pair.value);
      //   result = await createOrders(result.failure);
      // }
      return result;
    }
  }
};
