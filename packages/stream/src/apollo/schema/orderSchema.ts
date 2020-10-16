import { CACHE_TYPE_CLASS_ID } from "shared/src/cache/cacheConstants"
import { CacheMap } from "shared/src/cache/cacheMap"
import { schemaFactory } from "./schemaFactory"

export const orderSchema = schemaFactory(
    CacheMap.Order,
    `
    {
        id: String
        quantity: Float
        price: Float
        country: String
    }
        `,
)