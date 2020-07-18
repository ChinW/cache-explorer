/// <reference types="node" />
/// <reference types="long" />
import * as Long from 'long';
import { UUID } from '../../core/UUID';
export declare class FixSizedTypesCodec {
    static encodeInt(buffer: Buffer, offset: number, value: number): void;
    static decodeInt(buffer: Buffer, offset: number): number;
    static encodeLong(buffer: Buffer, offset: number, value: any): void;
    static decodeLong(buffer: Buffer, offset: number): Long;
    static encodeBoolean(buffer: Buffer, offset: number, value: boolean): void;
    static decodeBoolean(buffer: Buffer, offset: number): boolean;
    static encodeByte(buffer: Buffer, offset: number, value: number): void;
    static decodeByte(buffer: Buffer, offset: number): number;
    static encodeUUID(buffer: Buffer, offset: number, value: UUID): void;
    static decodeUUID(buffer: Buffer, offset: number): UUID;
}
