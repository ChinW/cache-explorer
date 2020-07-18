import { ClientMessage } from '../../ClientMessage';
import { Data } from '../../serialization/Data';
import { SimpleEntryView } from '../../core/SimpleEntryView';
export declare class SimpleEntryViewCodec {
    static encode(clientMessage: ClientMessage, simpleEntryView: SimpleEntryView<Data, Data>): void;
    static decode(clientMessage: ClientMessage): SimpleEntryView<Data, Data>;
}
