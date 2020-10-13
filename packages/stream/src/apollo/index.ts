import { ApolloServer } from 'apollo-server';

const server = new ApolloServer({
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const userID = '1';
    return { userID };
  }
});

const port = process.env.PORT || 4000;
server.listen({ port }).then(({ url }) => {
  console.log(`Apollo Server ready at ${url}`);
});
