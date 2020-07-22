import { PortableReader, PortableWriter } from "@chiw/hazelcast-client/lib/serialization/portable/PortableSerializer";

export class BaseType {
    readPortable = (input: PortableReader) => {
        for(const key of Object.keys(this)) {
          if(typeof this[key] !== 'function') {
            this[key] = input.readUTF(key);
          }
        }
      };
    
      writePortable = (output: PortableWriter) => {
        for(const key of Object.keys(this)) {
          if(typeof this[key] !== 'function') {
            output.writeUTF(key, this[key]);
          }
        }
      };
    
}