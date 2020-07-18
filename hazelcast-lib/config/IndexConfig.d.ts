import { IndexType } from './IndexType';
import { BitmapIndexOptions } from './BitmapIndexOptions';
/**
 * Configuration of an index. Hazelcast support two types of indexes: sorted index and hash index.
 * Sorted indexes could be used with equality and range predicates and have logarithmic search time.
 * Hash indexes could be used with equality predicates and have constant search time assuming the hash
 * function of the indexed field disperses the elements properly.
 *
 * Index could be created on one or more attributes.
 *
 * @see {@link IndexType}
 */
export declare class IndexConfig {
    /**
     * Default index type.
     */
    static readonly DEFAULT_TYPE: IndexType;
    /**
     * Name of the index.
     */
    name: string;
    /**
     * Type of the index.
     */
    type: IndexType;
    /**
     * Indexed attributes.
     */
    attributes: string[];
    bitmapIndexOptions: BitmapIndexOptions;
    constructor(name?: string, type?: IndexType, attributes?: string[], bitmapIndexOptions?: BitmapIndexOptions);
    addAttribute(attribute: string): IndexConfig;
    toString(): string;
}
