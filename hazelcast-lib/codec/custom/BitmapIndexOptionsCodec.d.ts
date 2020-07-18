import { ClientMessage } from '../../ClientMessage';
import { BitmapIndexOptions } from '../../config/BitmapIndexOptions';
export declare class BitmapIndexOptionsCodec {
    static encode(clientMessage: ClientMessage, bitmapIndexOptions: BitmapIndexOptions): void;
    static decode(clientMessage: ClientMessage): BitmapIndexOptions;
}
