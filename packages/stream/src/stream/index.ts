import { Cache } from 'shared/src/cache/cache';
import { CacheMap } from 'shared/src/cache/cacheMap';
import { OrderMutationEntryProcessor } from 'shared/src/cache/entryProcessor';
import { Environment } from 'shared/src/enums';
import { CacheType } from '../../../proto/proto';
import { StreamServer } from './streamServer';

export const start = async () => {
  // const server = new StreamServer();
  const cache = new Cache(Environment.DEV);
  const map = await cache.getMap(CacheMap.OrderMsg.name);
  map.executeOnKey('1', new OrderMutationEntryProcessor(99));
  // const values = await (await map.values()).toArray();
  console.log('values', await map.get('1'))
  // if(values.length > 0) {
  //   console.log(values[0].toJSON())
  // }
};

start();
// cacheReadPerfTest();