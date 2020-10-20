import { gql, makeExecutableSchema } from 'apollo-server';
import { resolvers } from 'graphql-scalars';
import { CACHE_TYPE_CLASS_ID } from 'shared/src/cache/cacheConstants';
import { CacheMap } from 'shared/src/cache/cacheMap';
import { schemaFactory } from './schemaFactory';

export const orderTypeSchema = {
  typeDefs: `
    interface OrderInterface {
        nxid: String
        id: String!
        quantity: Float
        price: Float
        country: String
    }
`
};

export const orderSchema = schemaFactory(
  CacheMap.Order,
  `
    {
        nxid: String
        id: String!
        quantity: Float
        price: Float
        country: String
    }
        `
);
