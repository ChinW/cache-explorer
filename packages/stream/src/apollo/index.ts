import { ApolloServer, makeExecutableSchema, mergeSchemas } from 'apollo-server';
import { log } from 'shared/src/logger';
import { schema } from './schema/schemaList';

const server = new ApolloServer({
  schema
});

server.listen().then(({ url, subscriptionsUrl }) => {
  log.info(`Apollo server ready at ${url}`);
  log.info(`Apollo subscription ready at ${subscriptionsUrl}`);
});
