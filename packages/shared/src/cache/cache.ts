import { Client, IMap, Predicates } from 'hazelcast-client';
import { ReadOnlyLazyList } from 'hazelcast-client/lib/core/ReadOnlyLazyList.js';
import { getClientConfig } from './cacheClientConfig';
import { log } from '../logger';
import { Env } from '../enums';

export class Cache {
  static client: Client | null = null;

  static getClient = async (env: Env): Promise<Client> => {
    if (Cache.client === null) {
      Cache.client = await Client.newHazelcastClient(getClientConfig(env));
      log.info('Hazelcast client initialized');
    }
    return Cache.client;
  };

  static getMap = async (env: Env, mapName: string): Promise<IMap<string, Cache.DataType> | null> => {
    try {
      if (mapName.length > 0) {
        const instance = await Cache.getClient(env);
        const map: IMap<string, Cache.DataType> = await instance.getMap(mapName);
        return map;
      }
      return null;
    } catch (err) {
      log.error(err);
      return null;
    }
  };

  static getValues = async (env: Env, mapName: string, filter: string): Promise<any[]> => {
    try {
      if (mapName.length > 0) {
        const map = await Cache.getMap(env, mapName);
        const values: ReadOnlyLazyList<Cache.DataType> =
          filter.length > 0 ? await map.valuesWithPredicate(Predicates.sql(filter)) : await map.values();
        const results = values.toArray();
        return results.map((i) => i.toObject());
      }
      return [];
    } catch (err) {
      log.error("Failure in getValues", err);
      return [];
    }
  };
}