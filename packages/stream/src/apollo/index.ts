import { ApolloServer, makeExecutableSchema, mergeSchemas } from 'apollo-server';
import { schema } from './schema/schemaList';

const server = new ApolloServer({
  schema
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Apollo server ready at ${url}`);
  console.log(`Apollo subscription ready at ${subscriptionsUrl}`);
});
