import { PortableBase } from './portableBase';
import { CACHE_TYPE_CLASS_ID } from '../cache/cacheConstants';

export class Client extends PortableBase {
  id: string = '';
  name: string = '';

  constructor() {
    super(CACHE_TYPE_CLASS_ID.CLIENT);
  }

  getIdentity = () => this.id;
}
