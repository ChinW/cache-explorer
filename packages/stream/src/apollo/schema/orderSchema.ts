import { CACHE_TYPE_CLASS_ID } from "shared/src/cache/cacheConstants"
import { schemaFactory } from "./schemaFactory"

export const orderSchema = schemaFactory(
    CACHE_TYPE_CLASS_ID.ORDER,
    `
    {
        id: String
        quantity: Float
        price: Float
        country: String
    }
        `,
)