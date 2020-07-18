import { ClientMessage } from '../ClientMessage';
export declare class ClientCreateProxiesCodec {
    static encodeRequest(proxies: Array<[string, string]>): ClientMessage;
}
