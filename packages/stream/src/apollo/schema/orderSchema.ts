import { gql, makeExecutableSchema } from 'apollo-server';
import { resolvers } from 'graphql-scalars';
import { CACHE_TYPE_CLASS_ID } from 'shared/src/cache/cacheConstants';
import { CacheMap } from 'shared/src/cache/cacheMap';
import { schemaFactory } from './schemaFactory';

export const orderFields = `
{
  nid: String
  id: String!
  parent: String!
  quantity: Float
  price: Float
  country: String
  clients: [Client]
  created: Float
  updated: Float
  timeCost: Float
}
`;

export const orderTypeSchema = {
  typeDefs: `
    type OrderInterface ${orderFields}
`
};

export const orderSchema = schemaFactory(
  CacheMap.Order,
  orderFields,
  `{
    quantity: Float
  }`
);
