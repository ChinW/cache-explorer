import { CacheMap } from "shared/src/cache/cacheMap"
import { schemaFactory } from "./schemaFactory"

export const clientSchema = schemaFactory(
    CacheMap.Client,
    `
    {
        id: String
        name: String
    }
        `,
)