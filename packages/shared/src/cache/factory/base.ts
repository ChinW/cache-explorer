import { PortableReader, PortableWriter } from 'hazelcast-client';
import { log } from '../../logger';
import { instanceOf } from 'hazelcast-client/lib/core/Predicate';

export class BaseType {
  isValidField = (fieldName: string): boolean => {
    // @ts-ignore
    const field = this[fieldName];
    const blacklistFields = ['factoryId', 'classId'];
    return typeof field !== 'function' && !blacklistFields.includes(fieldName);
  };

  isPortableField = (fieldName: string): boolean => {
    // @ts-ignore
    return BaseType.isPrototypeOf(this[fieldName]) || this[fieldName] instanceof BaseType;
  };

  toObject = () => {
    const obj: any = {};
    for (const key of Object.keys(this)) {
      if (this.isValidField(key)) {
        // @ts-ignore
        const field = this[key];
        if (this.isPortableField(key)) {
          obj[key] = field.toObject();
        } else {
          obj[key] = field;
        }
      }
    }
    return obj;
  };

  readPortable = (input: PortableReader) => {
    for (const key of Object.keys(this)) {
      if (this.isValidField(key)) {
        if (this.isPortableField(key)) {
          log.info("read key", key)
          // @ts-ignore
          this[key] = input.readPortable(key);
        } else {
          // @ts-ignore
          this[key] = input.readUTF(key);
        }
      }
    }
  };

  writePortable = (output: PortableWriter) => {
    for (const key of Object.keys(this)) {
      if (this.isValidField(key)) {
        if (this.isPortableField(key)) {
          // @ts-ignore
          output.writePortable(key, this[key]);
        } else {
          // @ts-ignore
          output.writeUTF(key, this[key]);
        }
      }
    }
  };
}
