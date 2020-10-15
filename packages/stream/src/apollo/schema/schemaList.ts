import { mergeSchemas } from 'apollo-server';
import { CacheMap, CacheType } from 'shared/src/types/cacheMap';
import { schemaFactory } from '../schema';

const schemaList: {
  [key in keyof typeof CacheType]?: string;
} = {
  ORDER: `
{
    id: String
    quantity: Float
    price: Float
    country: String
}
    `,
  CLIENT: `
{
    id: String
    name: String
}
    `
};

export const schema = mergeSchemas({
    schemas: Object.keys(schemaList).map((cacheTypeKey: keyof typeof CacheType) => {
        return schemaFactory(
            CacheMap[cacheTypeKey],
            schemaList[cacheTypeKey]
        )
    })
})