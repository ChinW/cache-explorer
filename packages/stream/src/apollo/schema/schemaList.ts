import { gql, makeExecutableSchema, mergeSchemas } from 'apollo-server';
import { clientSchema } from './clientSchema';
import { orderSchema, orderTypeSchema } from './orderSchema';
import _ from 'lodash';

export const schema = mergeSchemas({
  schemas: [
      orderTypeSchema.typeDefs,
      clientSchema.typeDefs,
      orderSchema.typeDefs,
  ],
  resolvers: [
    orderSchema.resolvers,
    clientSchema.resolvers
  ]
});
