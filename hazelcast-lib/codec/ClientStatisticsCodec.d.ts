/// <reference types="long" />
/// <reference types="node" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
export declare class ClientStatisticsCodec {
    static encodeRequest(timestamp: Long, clientAttributes: string, metricsBlob: Buffer): ClientMessage;
}
