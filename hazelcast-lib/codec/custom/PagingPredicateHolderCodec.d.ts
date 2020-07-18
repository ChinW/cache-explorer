import { ClientMessage } from '../../ClientMessage';
import { PagingPredicateHolder } from '../../protocol/PagingPredicateHolder';
export declare class PagingPredicateHolderCodec {
    static encode(clientMessage: ClientMessage, pagingPredicateHolder: PagingPredicateHolder): void;
    static decode(clientMessage: ClientMessage): PagingPredicateHolder;
}
