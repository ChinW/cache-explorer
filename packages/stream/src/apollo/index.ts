import { ApolloServer, gql } from 'apollo-server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Apollo server ready at ${url}`);
  console.log(`Apollo subscription ready at ${subscriptionsUrl}`);
});
