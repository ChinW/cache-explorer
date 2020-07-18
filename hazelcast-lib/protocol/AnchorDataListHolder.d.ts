import { Data } from '../serialization/Data';
import { SerializationService } from '../serialization/SerializationService';
export declare class AnchorDataListHolder {
    anchorPageList: number[];
    anchorDataList: Array<[Data, Data]>;
    constructor(anchorPageList: number[], anchorDataList: Array<[Data, Data]>);
    asAnchorList<K, V>(serializationService: SerializationService): Array<[number, [K, V]]>;
}
