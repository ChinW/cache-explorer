import { gql, makeExecutableSchema } from 'apollo-server';
import { PortableBase } from 'shared/src/types/portableBase';
import { Cache } from 'shared/src/cache/cache';
import _ from 'lodash';
import { getProccessArgs } from 'shared/src/utils';

const processArgs = getProccessArgs();
const cacheClient = new Cache(processArgs.env);

const createTypeDefs = (opts: { name: string; fields: string; editableFields?: string }) => {
  const { name, fields } = opts;
  const editable = opts.editableFields || fields;
  return `
  type ${name} ${fields}
  
  input editable${name} ${editable}
  input editable${name}Entry {
    key: String
    value: editable${name}
  }

  type ${name}UpdateResponse {
    success: [${name}]
    failure: [${name}]
  }

  type Query {
    ${name.toLowerCase()}: [${name}]
  }
  type Mutation {
    put${name}(items: [editable${name}!]!): [${name}]
    update${name}(pairs: [editable${name}Entry!]): ${name}UpdateResponse 
  }
  `;
};

const createPortableObject = async (cache: Cache.CacheMap, items: Dict[]): Promise<PortableBase[]> => {
  const objs: PortableBase[] = [];
  for (const item of items) {
    const obj = new cache.type.typeConstructor();
    obj.acceptUpdate(item);
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

export const schemaFactory = (cache: Cache.CacheMap, fields: string, editableFields: string = null) => {
  const typeDefs = createTypeDefs({
    name: _.capitalize(cache.name),
    fields,
    editableFields
  });
  const resolvers = createResolvers(cache);
  return {
    typeDefs,
    resolvers
  };
};
