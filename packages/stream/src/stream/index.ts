import { Cache } from 'shared/src/cache/cache';
import { CacheMap } from 'shared/src/cache/cacheMap';
import { Environment } from 'shared/src/enums';
import { CacheType } from '../../../proto/proto';
import { StreamServer } from './streamServer';


export const playground = () => {
  const order = new CacheType.OrderMsg();
  console.log('order', Object.keys(CacheType.OrderMsg))
  console.log('order', new CacheType.OrderMsg())
}

export const start = async () => {
  // const server = new StreamServer();
  const cache = new Cache(Environment.DEV);
  const values = await cache.getValues(CacheMap.OrderMsg.name, '');
  // const values = await (await map.values()).toArray();
  console.log('values', values.length)
  // if(values.length > 0) {
  //   console.log(values[0].toJSON())
  // }
};

playground();
// cacheReadPerfTest();