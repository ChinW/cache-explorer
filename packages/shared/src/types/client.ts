import { BaseType } from './base';
import { CACHE_TYPE_CLASS_ID } from '../cache/cacheConstants';

export class Client extends BaseType {
  id: string = '';
  name: string = '';

  constructor() {
    super(CACHE_TYPE_CLASS_ID.CLIENT);
  }
}