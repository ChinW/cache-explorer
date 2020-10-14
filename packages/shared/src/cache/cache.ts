import { Client, IMap, Predicates } from 'hazelcast-client';
import { ReadOnlyLazyList } from 'hazelcast-client/lib/core/ReadOnlyLazyList.js';
import { getClientConfig } from './cacheClientConfig';
import { log } from '../logger';
import { Environment } from '../enums';

export class Cache {
  client: Client = null;
  env: Environment = Environment.DEV;

  constructor(env: Environment) {
    this.env = env;
  }

  initClient = async (): Promise<Client> => {
    this.client = await Client.newHazelcastClient(getClientConfig(this.env));
    log.info('Hazelcast client initialized');
    return this.client;
  };

  getClient = async (): Promise<Client> => {
    if (this.client === null) {
      await this.initClient();
    }
    return this.client;
  };

  getMap = async (mapName: string): Promise<IMap<string, Cache.DataType> | null> => {
    try {
      if (mapName.length > 0) {
        const instance = await this.getClient();
        const map: IMap<string, Cache.DataType> = await instance.getMap(mapName);
        return map;
      }
      return null;
    } catch (err) {
      log.error("Failure in getMap", err);
      return null;
    }
  };

  getValues = async (mapName: string, filter: string): Promise<any[]> => {
    try {
      if (mapName.length > 0) {
        const map = await this.getMap(mapName);
        const values: ReadOnlyLazyList<Cache.DataType> =
          filter.length > 0 ? await map.valuesWithPredicate(Predicates.sql(filter)) : await map.values();
        const results = values.toArray();
        return results.map((i) => i.toObject());
      }
      return [];
    } catch (err) {
      log.error('Failure in getValues', err);
      return [];
    }
  };

  setValue = async (mapName: string, key: string, value: any): Promise<any> => {
    try {
      if (mapName.length > 0) {
        const map = await this.getMap(mapName);
        await map.put(key, value);
        return value;
      }
      return null;
    } catch (err) {
      log.error('Failure in setValue', err);
      return null;
    }
  };
}
