import { gql } from 'apollo-server';

const makeSchema = (typeName: string, typeDefinition: string) => {
  return gql`
  type ${typeName} ${typeDefinition}
  input ${typeName}Input ${typeDefinition}
  input ${typeName}EntryInput {
    key: String
    value: ${typeName}Input
  }

  type orderOutput {
    success: [Orders]
    failure: [Orders]
  }

  type Query {
    ${typeName.toLowerCase()}: [${typeName}]
  }
  type Mutation {
    put${typeName}(items: [${typeName}Input!]!): [${typeName}]
    update${typeName}(pairs: [${typeName}EntryInput!]): orderOutput
  }
  `;
};
export const typeDefs = makeSchema(
  'Orders',
  `{
  id: String
  quantity: Float
  price: Float
  country: String
}`
);

// export const typeDefs = gql`
//   type Order {
//     id: String
//     quantity: Float
//     price: Float
//     country: String
//   }

//   input OrderInput {
//     quantity: Float
//     price: Float
//     country: String
//   }

//   type Query {
//     orders: [Order]
//   }

//   type Mutation {
//     updateOrder(key: String!, update: OrderInput!): Order
//     createOrder(key: String!, values: OrderInput!): Order
//   }
// `;
