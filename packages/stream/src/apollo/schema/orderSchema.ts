import { gql, makeExecutableSchema } from 'apollo-server';
import { resolvers } from 'graphql-scalars';
import { CACHE_TYPE_CLASS_ID } from 'shared/src/cache/cacheConstants';
import { CacheMap } from 'shared/src/cache/cacheMap';
import { schemaFactory } from './schemaFactory';

export const orderFields = `
{
  nxid: String
  groupId: Float
  id: String!
  quantity: Float
  price: Float
  country: String
  clients: [Client]
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
