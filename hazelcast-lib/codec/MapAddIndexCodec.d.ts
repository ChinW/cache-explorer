import { ClientMessage } from '../ClientMessage';
import { IndexConfig } from '../config/IndexConfig';
export declare class MapAddIndexCodec {
    static encodeRequest(name: string, indexConfig: IndexConfig): ClientMessage;
}
