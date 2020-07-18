import { ClientMessage } from './ClientMessage';
import { UUID } from './core/UUID';
export interface ListenerMessageCodec {
    encodeAddRequest: (localOnly: boolean) => ClientMessage;
    decodeAddResponse: (msg: ClientMessage) => UUID;
    encodeRemoveRequest: (listenerId: UUID) => ClientMessage;
}
