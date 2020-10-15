import { Client, IMap, Predicates } from 'hazelcast-client';
import { ReadOnlyLazyList } from 'hazelcast-client/lib/core/ReadOnlyLazyList.js';
import { getClientConfig } from './cacheClientConfig';
import { log } from '../logger';
import { Environment } from '../enums';
import { PortableBase } from '../types/portableBase';

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

  getMap = async (mapName: string): Promise<IMap<string, PortableBase> | null> => {
    try {
      if (mapName.length > 0) {
        const instance = await this.getClient();
        const map: IMap<string, PortableBase> = await instance.getMap(mapName);
        return map;
      }
      return null;
    } catch (err) {
      log.error('Failure in getMap', err);
      return null;
    }
  };

  getValues = async (
    mapName: string,
    filter: string
  ): Promise<Array<PortableBase>> => {
    try {
      if (mapName.length > 0) {
        const map = await this.getMap(mapName);
        const values: ReadOnlyLazyList<PortableBase> =
          filter.length > 0 ? await map.valuesWithPredicate(Predicates.sql(filter)) : await map.values();
        const results = values.toArray();
        return results;
      }
      return [];
    } catch (err) {
      log.error('Failure in getValues', err);
      return [];
    }
  };

  put = async (mapName: string, key: string, value: PortableBase): Promise<PortableBase> => {
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

  update = async (
    mapName: string,
    key: string,
    update: {
      [key: string]: any;
    }
  ): Promise<PortableBase | null> => {
    try {
      if (mapName.length > 0) {
        const map = await this.getMap(mapName);
        const entry: PortableBase = await map.get(key);
        if (entry !== null) {
          entry.acceptUpdate(update);
          await map.set(key, entry);
          return entry;
        } else {
          throw Error('Key not exists');
        }
      }
    } catch (err) {
      log.error('Failure in setValue', err);
      return null;
    }
  };
}
