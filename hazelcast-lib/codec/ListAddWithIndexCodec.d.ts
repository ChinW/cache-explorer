import { ClientMessage } from '../ClientMessage';
import { Data } from '../serialization/Data';
export declare class ListAddWithIndexCodec {
    static encodeRequest(name: string, index: number, value: Data): ClientMessage;
}
