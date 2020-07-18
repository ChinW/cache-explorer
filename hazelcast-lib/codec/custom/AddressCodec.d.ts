import { ClientMessage } from '../../ClientMessage';
import { Address } from '../../Address';
export declare class AddressCodec {
    static encode(clientMessage: ClientMessage, address: Address): void;
    static decode(clientMessage: ClientMessage): Address;
}
