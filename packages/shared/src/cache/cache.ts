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

  getValues = async (mapName: string, filter: string): Promise<Array<PortableBase>> => {
    try {
      const map = await this.getMap(mapName);
      const values: ReadOnlyLazyList<PortableBase> =
        filter.length > 0 ? await map.valuesWithPredicate(Predicates.sql(filter)) : await map.values();
      const results = values.toArray();
      return results;
    } catch (err) {
      log.error('Failure in getValues', err);
      return [];
    }
  };

  putAll = async (mapName: string, items: PortableBase[]): Promise<PortableBase[] | null> => {
    try {
      const map = await this.getMap(mapName);
      await map.putAll(items.map((item) => [item.getKey(), item]));
      return items;
    } catch (err) {
      log.error('Failure in setValue', err);
      return null;
    }
  };

  updateAll = async (
    mapName: string,
    updates: KV<String, Dict>
  ): Promise<{
    success: PortableBase[];
    failure: Dict[];
  }> => {
    const success: PortableBase[] = [];
    const failure: Dict[] = [];
    try {
      const map = await this.getMap(mapName);
      const entries: [string, PortableBase][] = await map.getAll(Object.keys(updates));
      for (const entry of entries) {
        if (entry[1] !== null) {
          entry[1].acceptUpdate(updates[entry[0]]);
          success.push(entry[1]);
        } else {
          failure.push(updates[entry[0]]);
        }
      }
      await map.putAll(entries);
    } catch (err) {
      log.error('Failure in setValue', err);
    } finally {
      return {
        success,
        failure
      };
    }
  };
}
