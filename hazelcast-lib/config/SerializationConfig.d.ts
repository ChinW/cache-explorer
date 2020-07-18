import { IdentifiedDataSerializableFactory, PortableFactory } from '../serialization/Serializable';
import { ImportConfig } from './ImportConfig';
import { JsonStringDeserializationPolicy } from './JsonStringDeserializationPolicy';
export declare class SerializationConfig {
    defaultNumberType: string;
    isBigEndian: boolean;
    dataSerializableFactories: {
        [id: number]: IdentifiedDataSerializableFactory;
    };
    dataSerializableFactoryConfigs: {
        [id: number]: ImportConfig;
    };
    portableFactories: {
        [id: number]: PortableFactory;
    };
    portableFactoryConfigs: {
        [id: number]: ImportConfig;
    };
    portableVersion: number;
    customSerializers: any[];
    customSerializerConfigs: {
        [id: number]: ImportConfig;
    };
    globalSerializer: any;
    globalSerializerConfig: ImportConfig;
    jsonStringDeserializationPolicy: JsonStringDeserializationPolicy;
}