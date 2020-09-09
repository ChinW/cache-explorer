import { BaseType } from './base';
import { Portable } from 'hazelcast-client';
import { FACTORY_ID, CACHE_TYPE_CLASS_ID } from '../cacheConstants';

export class Client extends BaseType {
  id: string = '';
  name: string = '';

  constructor() {
    super(CACHE_TYPE_CLASS_ID.CLIENT);
  }
}
