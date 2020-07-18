/// <reference types="long" />
import { ClientMessage } from '../ClientMessage';
import * as Long from 'long';
export interface FlakeIdGeneratorNewIdBatchResponseParams {
    base: Long;
    increment: Long;
    batchSize: number;
}
export declare class FlakeIdGeneratorNewIdBatchCodec {
    static encodeRequest(name: string, batchSize: number): ClientMessage;
    static decodeResponse(clientMessage: ClientMessage): FlakeIdGeneratorNewIdBatchResponseParams;
}
