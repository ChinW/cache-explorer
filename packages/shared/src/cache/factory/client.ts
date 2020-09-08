import { BaseType } from './base';
import { Portable } from 'hazelcast-client';
import { FACTORY_ID, CACHE_TYPE_CLASS_ID } from '../cacheConstants';

export class Client extends BaseType implements Portable, Cache.DataType {
  factoryId: number = FACTORY_ID;
  classId: number = CACHE_TYPE_CLASS_ID.CLIENT;
  id: string = '';
  name: string = '';
}
