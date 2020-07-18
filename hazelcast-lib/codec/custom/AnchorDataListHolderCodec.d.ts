import { ClientMessage } from '../../ClientMessage';
import { AnchorDataListHolder } from '../../protocol/AnchorDataListHolder';
export declare class AnchorDataListHolderCodec {
    static encode(clientMessage: ClientMessage, anchorDataListHolder: AnchorDataListHolder): void;
    static decode(clientMessage: ClientMessage): AnchorDataListHolder;
}
