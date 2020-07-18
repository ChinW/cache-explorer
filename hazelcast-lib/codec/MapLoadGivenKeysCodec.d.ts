import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export declare class MapLoadGivenKeysCodec {
    static encodeRequest(name: string, keys: Data[], replaceExistingValues: boolean): ClientMessage;
}
