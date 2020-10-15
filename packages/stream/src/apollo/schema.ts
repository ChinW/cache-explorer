import { gql } from 'apollo-server';

const order = gql`
  type Order {
    id: String
    quantity: Float
    price: Float
    country: String
  }
  input OrderInput {
    quantity: Float
    price: Float
    country: String
  }
`;

export const typeDefs = gql`
  ${order}

  type Query {
    orders: [Order]
  }

  type Mutation {
    updateOrder(key: String!, update: OrderInput!): Order
    createOrder(key: String!, values: OrderInput!): Order
  }
`;
