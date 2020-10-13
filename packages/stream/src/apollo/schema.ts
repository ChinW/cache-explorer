import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Order {
    id: String
    quantity: String
    price: String
    country: String
  }

  type Query {
    orders: [Order]
  }

  type Mutation {
    updateOrder: Order
  }
`;
