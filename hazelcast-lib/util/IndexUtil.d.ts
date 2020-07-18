import { IndexConfig } from '../config/IndexConfig';
export declare class IndexUtil {
    /**
     * Validate provided index config and normalize it's name and attribute names.
     *
     * @param mapName Name of the map
     * @param config Index config.
     * @return Normalized index config.
     * @throws TypeError If index configuration is invalid.
     */
    static validateAndNormalize(mapName: string, config: IndexConfig): IndexConfig;
    /**
     * Validate attribute name.
     *
     * @param config Index config.
     * @param attributeName Attribute name.
     */
    static validateAttribute(config: IndexConfig, attributeName: string): void;
    /**
     * Produces canonical attribute representation by stripping an unnecessary
     * "this." qualifier from the passed attribute, if any.
     *
     * @param attribute the attribute to canonicalize.
     * @return the canonical attribute representation.
     */
    static canonicalizeAttribute(attribute: string): string;
    private static buildNormalizedConfig(mapName, indexType, indexName, normalizedAttributeNames);
    private static getIndexTypeName(indexType);
}
