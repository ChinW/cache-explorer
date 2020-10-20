import { CacheMap } from "shared/src/cache/cacheMap"
import { schemaFactory } from "./schemaFactory"

export const clientSchema = schemaFactory(
    CacheMap.Client,
    `
    {
        nxid: String
        id: String
        name: String
    }
        `,
)