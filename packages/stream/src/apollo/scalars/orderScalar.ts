import {
  GraphQLFloat,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
  Kind,
  ObjectValueNode,
  ValueNode
} from 'graphql';
import { log } from 'shared/src/logger';
import { Order } from 'shared/src/types/order';

function parseObject(
  typeName: string,
  ast: ObjectValueNode,
  variables: {
    [key: string]: any;
  }
) {
  const value = Object.create(null);
  ast.fields.forEach((field) => {
    value[field.name.value] = parseLiteral(typeName, field.value, variables);
  });

  return value;
}

function parseLiteral(
  typeName: string,
  ast: ValueNode,
  variables: {
    [key: string]: any;
  }
) {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      return parseObject(typeName, ast, variables);
    case Kind.LIST:
      return ast.values.map((n) => parseLiteral(typeName, n, variables));
    case Kind.NULL:
      return null;
    case Kind.VARIABLE:
      return variables ? variables[ast.name.value] : undefined;
    default:
      throw new TypeError(`${typeName} cannot represent value: ${log.error(ast)}`);
  }
}

export const OrderScalar = new GraphQLObjectType({
  name: 'Order',
  description: 'Order',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    quantity: {
      type: GraphQLFloat
    },
    price: {
      type: GraphQLFloat
    },
    country: {
      type: GraphQLString
    }
  })
  //   parseValue(value: any): Order {
  //     log.info(`value from client`, value);
  //     const order = new Order();
  //     order.fromObject(value);
  //     return order;
  //   },
  //   serialize(value: Order) {
  //     return value;
  //   },
  //   parseLiteral: (ast, variables) => {
  //     console.log('parseLiteral', parseLiteral);
  //     if (ast.kind !== Kind.OBJECT) {
  //       throw new TypeError(`JSONObject cannot represent non-object value: ${log.error(ast)}`);
  //     }
  //     return parseObject('Order', ast, variables);
  //   }
});
