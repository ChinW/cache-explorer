import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Order {
    id: String
    quantity: Float
    price: Float
    country: String
  }
 
  input OrderInput {
    id: String
    quantity: Float
    price: Float
    country: String
  }

  type Query {
    orders: [Order]
  }

  type Mutation {
    updateOrder(order: OrderInput!): Order
  }
`;
