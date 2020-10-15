import { gql, makeExecutableSchema } from 'apollo-server';
import { PortableBase } from 'shared/src/types/portableBase';
import { Cache } from 'shared/src/cache/cache';
import { Environment } from 'shared/src/enums';
import _ from 'lodash';

const cacheClient = new Cache(Environment.DEV);

const createTypeDefs = (typeName: string, typeDefinition: string) => {
  return gql`
  type ${typeName} ${typeDefinition}
  input ${typeName}Input ${typeDefinition}
  input ${typeName}EntryInput {
    key: String
    value: ${typeName}Input
  }

  type ${typeName}UpdateResponse {
    success: [${typeName}]
    failure: [${typeName}]
  }

  type Query {
    ${typeName.toLowerCase()}: [${typeName}]
  }
  type Mutation {
    put${typeName}(items: [${typeName}Input!]!): [${typeName}]
    update${typeName}(pairs: [${typeName}EntryInput!]): ${typeName}UpdateResponse 
  }
  `;
};

const createPortableObject = async (cache: Cache.CacheMap, items: Dict[]): Promise<PortableBase[]> => {
  const objs: PortableBase[] = [];
  for (const item of items) {
    const obj = new cache.typeConstructor();
    obj.acceptUpdate(item);
    obj.generateKey();
    objs.push(obj);
  }
  const result = await cacheClient.putAll(cache.name, objs);
  return result;
};

const createResolvers = (cache: Cache.CacheMap) => {
  const typeName = _.capitalize(cache.name);
  return {
    Query: {
      [typeName.toLowerCase()]: async (): Promise<PortableBase[]> => {
        try {
          const result = await cacheClient.getValues(cache.name, '');
          return result;
        } catch (e) {
          console.log('error', e);
          return [];
        }
      }
    },
    Mutation: {
      [`put${typeName}`]: async (
        parent: any,
        args: {
          items: Dict[];
        }
      ): Promise<PortableBase[]> => {
        return await createPortableObject(cache, args.items);
      },
      [`update${typeName}`]: async (
        parent: any,
        args: {
          pairs: KVPair<string, Dict>[];
        }
      ): Promise<{
        success: PortableBase[];
        failure: Dict[];
      }> => {
        const { pairs } = args;
        const updates: KV<String, Dict> = {};
        for (const pair of pairs) {
          updates[pair.key] = pair.value;
        }
        let result = await cacheClient.updateAll(cache.name, updates);
        return result;
      }
    }
  };
};

export const schemaFactory = (cache: Cache.CacheMap, typeFields: string) => {
  const typeDefs = createTypeDefs(_.capitalize(cache.name), typeFields);
  const resolvers = createResolvers(cache);
  return makeExecutableSchema({
    typeDefs,
    resolvers
  });
};
