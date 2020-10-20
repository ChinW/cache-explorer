import { gql, makeExecutableSchema, mergeSchemas } from 'apollo-server';
import { stitchSchemas } from '@graphql-tools/stitch';
import { clientSchema } from './clientSchema';
import { orderSchema, orderTypeSchema } from './orderSchema';
import _ from 'lodash';

export const schema = mergeSchemas({
  schemas: [
      orderTypeSchema.typeDefs,
      orderSchema.typeDefs,
      clientSchema.typeDefs
  ],
  resolvers: [
    orderSchema.resolvers,
    clientSchema.resolvers
  ]
});
