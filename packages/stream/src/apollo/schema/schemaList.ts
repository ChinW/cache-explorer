import { mergeSchemas } from 'apollo-server';
import { clientSchema } from './clientSchema';
import { orderSchema } from './orderSchema';

export const schema = mergeSchemas({
  schemas: [
      orderSchema,
      clientSchema
  ]
});
