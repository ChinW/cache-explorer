import { DataInput, DataOutput } from 'hazelcast-client';
import { Reader } from 'protobufjs';
import { CacheType } from '../../../proto/proto';

export class OrderBufSerializer {
  id: number = 100;
  constructor() {}

  read(input: DataInput): CacheType.OrderMsg {
    const buffer: Buffer = (input as any).buffer;
    const obj: CacheType.OrderMsg = CacheType.OrderMsg.decode(input.readByteArray());
    return obj
  }

  write(ouput: DataOutput, obj: CacheType.OrderMsg) {}
}
