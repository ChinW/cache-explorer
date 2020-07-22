import { Client, Config, IMap } from "@chiw/hazelcast-client/lib/index.js";
import { ReadOnlyLazyList } from "@chiw/hazelcast-client/lib/core/ReadOnlyLazyList.js";
import { SqlPredicate } from "@chiw/hazelcast-client/lib/serialization/DefaultPredicates.js";
import { CachePortableFactory } from "./cacheFactory/portableFactory";
import { FACTORY_ID } from "./cacheFactory/cacheConstants";

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
    }
    return HazelcastUtils.client;
  };

  static getValues = async (query: CacheQuery): Promise<any[]> => {
    try {
      if (query.map.length > 0) {
        const instance = await HazelcastUtils.getClient(query.env);
        const map: IMap<string, CacheType> = await instance.getMap(query.map);
        const values: ReadOnlyLazyList<CacheType> =
          query.filter.length > 0 ? await map.valuesWithPredicate(new SqlPredicate(query.filter)) : await map.values();
        const results = values.toArray();
        return results.map((i) => i.toObject());
      }
      return [];
    } catch (err) {
      console.log("error", err);
      return [];
    }
  };
}
