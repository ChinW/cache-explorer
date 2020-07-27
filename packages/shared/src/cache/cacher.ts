import { Client, Config, IMap } from "@chiw/hazelcast-client/lib/index.js";
import { ReadOnlyLazyList } from "@chiw/hazelcast-client/lib/core/ReadOnlyLazyList.js";
import { SqlPredicate } from "@chiw/hazelcast-client/lib/serialization/DefaultPredicates.js";
import { CachePortableFactory } from "./factory/portableFactory";
import { FACTORY_ID } from "./cacheConstants";
import { log } from "../logger";
import { Env } from "../enums";

export const FACTORIES = {
  [FACTORY_ID]: new CachePortableFactory(),
};

export class Cacher {
  static client: Client | null = null;

  static getClient = async (env: Env): Promise<Client> => {
    if (Cacher.client === null) {
      const clientConfig = new Config.ClientConfig();
      clientConfig.clusterName = "jet";
      Object.keys(FACTORIES).map((factoryId) => {
        clientConfig.serializationConfig.portableFactories[factoryId] = FACTORIES[factoryId];
      });
      Cacher.client = await Client.newHazelcastClient(clientConfig);
      log.info("Hazelcast client initialized");
    }
    return Cacher.client;
  };

  static getMap = async (env: Env, mapName: string): Promise<IMap<string, Cache.DataType> | null> => {
    try {
      if (mapName.length > 0) {
        const instance = await Cacher.getClient(env);
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
        const map = await Cacher.getMap(env, mapName);
        const values: ReadOnlyLazyList<Cache.DataType> =
          filter.length > 0 ? await map.valuesWithPredicate(new SqlPredicate(filter)) : await map.values();
        const results = values.toArray();
        return results.map((i) => i.toObject());
      }
      return [];
    } catch (err) {
      log.error(err);
      return [];
    }
  };
}
