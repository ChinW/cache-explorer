import { Client, IMap, LifecycleState, Predicates } from 'hazelcast-client';
import { ReadOnlyLazyList } from 'hazelcast-client/lib/core/ReadOnlyLazyList.js';
import { getClientConfig } from './cacheClientConfig';
import { log } from '../logger';
import { Environment } from '../enums';
import { PortableBase } from '../types/portableBase';
// import { OrderMsg } from '../../../proto/order';
import { CacheType } from '../../../proto/proto';
import { CacheMap } from './cacheMap';

export class Cache {
  client: Client = null;
  env: Environment = Environment.DEV;

  constructor(env: Environment) {
    this.env = env;
  }

  initClient = async (): Promise<Client> => {
    const clientCfg = getClientConfig(this.env);
    clientCfg.lifecycleListeners = [this.onClientLifeCycle];
    this.client = await Client.newHazelcastClient(clientCfg);
    log.info('Hazelcast client initialized');
    return this.client;
  };

  onClientLifeCycle = (state: LifecycleState) => {
    switch (state) {
      case LifecycleState.DISCONNECTED:
      case LifecycleState.SHUTTING_DOWN:
      case LifecycleState.SHUTDOWN:
        {
          this.client = null;
        }
        break;
    }
  };

  getClient = async (): Promise<Client> => {
    if (this.client === null) {
      await this.initClient();
      this.client.getLifecycleService;
    }
    return this.client;
  };

  getMap = async (mapName: string): Promise<IMap<string, any> | null> => {
    try {
      if (mapName.length > 0) {
        const instance = await this.getClient();
        const map: IMap<string, PortableBase> = await instance.getMap(mapName);
        return map;
      }
      return null;
    } catch (err) {
      log.error('Failure in getMap: %s', err);
      return null;
    }
  };

  getValues = async (mapName: string, filter: string): Promise<Array<any>> => {
    try {
      const map = await this.getMap(mapName);
      console.log(await map.size());
      if (mapName === CacheMap.OrderMsg.name) {
        const values: ReadOnlyLazyList<CacheType.OrderMsg> =
          filter.length > 0 ? await map.valuesWithPredicate(Predicates.sql(filter)) : await map.values();
        const results = values.toArray();
        return results;
      } else {
        const values: ReadOnlyLazyList<PortableBase> =
          filter.length > 0 ? await map.valuesWithPredicate(Predicates.sql(filter)) : await map.values();
        const results = values.toArray();
        return results;
      }
    } catch (err) {
      log.error('Failure in getValues: %s', err);
      return [];
    }
  };

  putAll = async (mapName: string, items: PortableBase[]): Promise<PortableBase[] | null> => {
    try {
      const map = await this.getMap(mapName);
      await map.putAll(items.map((item) => [item.getIdentity(), item]));
      return items;
    } catch (err) {
      log.error('Failure in setValue: %s', err);
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
      log.error('Failure in setValue: %s', err);
    } finally {
      return {
        success,
        failure
      };
    }
  };
}
