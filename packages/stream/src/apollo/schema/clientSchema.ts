import { CACHE_TYPE_CLASS_ID } from "shared/src/cache/cacheConstants"
import { schemaFactory } from "./schemaFactory"

export const clientSchema = schemaFactory(
    CACHE_TYPE_CLASS_ID.CLIENT,
    `
    {
        id: String
        name: String
    }
        `,
)