import { DataInput, DataOutput } from './Data';
import { IdentifiedDataSerializable, IdentifiedDataSerializableFactory } from './Serializable';
import { Serializer } from './SerializationService';
import { HazelcastJsonValue } from '../core/HazelcastJsonValue';
export declare class StringSerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class DoubleSerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class BooleanSerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class NullSerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class ShortSerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class IntegerSerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class LongSerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class FloatSerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class DateSerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class BooleanArraySerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class ShortArraySerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class IntegerArraySerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class LongArraySerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class DoubleArraySerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class StringArraySerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class ByteSerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class ByteArraySerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class CharSerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class CharArraySerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class FloatArraySerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class JavaClassSerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class LinkedListSerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class ArrayListSerializer extends LinkedListSerializer {
    getId(): number;
}
export declare class IdentifiedDataSerializableSerializer implements Serializer {
    private factories;
    constructor(factories: {
        [id: number]: IdentifiedDataSerializableFactory;
    });
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: IdentifiedDataSerializable): void;
}
export declare class JsonSerializer implements Serializer {
    getId(): number;
    read(input: DataInput): any;
    write(output: DataOutput, object: any): void;
}
export declare class HazelcastJsonValueSerializer extends JsonSerializer {
    read(input: DataInput): HazelcastJsonValue;
}