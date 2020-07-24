import { Client, Config, IMap } from "@chiw/hazelcast-client/lib/index.js";
import { ReadOnlyLazyList } from "@chiw/hazelcast-client/lib/core/ReadOnlyLazyList.js";
import { SqlPredicate } from "@chiw/hazelcast-client/lib/serialization/DefaultPredicates.js";
import { CachePortableFactory } from "./cacheFactory/portableFactory";
import { FACTORY_ID } from "./cacheFactory/cacheConstants";
import { log } from "./logger";
import { Env } from "../types/enum";

export const FACTORIES = {
  [FACTORY_ID]: new CachePortableFactory(),
};

export class HazelcastUtils {
  static client: Client | null = null;

  static getClient = async (env: Env): Promise<Client> => {
    if (HazelcastUtils.client === null) {
      const clientConfig = new Config.ClientConfig();
      clientConfig.clusterName = "jet";
      Object.keys(FACTORIES).map((factoryId) => {
        clientConfig.serializationConfig.portableFactories[factoryId] = FACTORIES[factoryId];
      });
      HazelcastUtils.client = await Client.newHazelcastClient(clientConfig);
      log.info("Hazelcast client initialized");
    }
    return HazelcastUtils.client;
  };

  static getMap = async (env: Env, mapName: string): Promise<IMap<string, CacheType> | null> => {
    try {
      if (mapName.length > 0) {
        const instance = await HazelcastUtils.getClient(env);
        const map: IMap<string, CacheType> = await instance.getMap(mapName);
        return map;
      }
      return null;
    } catch (err) {
      log.error(err);
      return null;
    }
  };

  static getValues = async (query: CacheQuery): Promise<any[]> => {
    try {
      if (query.map.length > 0) {
        const map = await HazelcastUtils.getMap(query.env, query.map);
        const values: ReadOnlyLazyList<CacheType> =
          query.filter.length > 0 ? await map.valuesWithPredicate(new SqlPredicate(query.filter)) : await map.values();
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
