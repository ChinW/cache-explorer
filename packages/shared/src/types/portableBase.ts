import { PortableReader, PortableWriter, Portable } from 'hazelcast-client';
import { log } from '../logger';
import { FACTORY_ID, CACHE_TYPE_CLASS_ID } from '../cache/cacheConstants';

export class PortableBase implements Portable {
  factoryId: number = FACTORY_ID;
  classId: number;

  constructor(classId: CACHE_TYPE_CLASS_ID) {
    this.classId = classId;
  }

  isValidField = (fieldName: string): boolean => {
    // @ts-ignore
    const field = this[fieldName];
    const blacklistFields = ['factoryId', 'classId'];
    return typeof field !== 'function' && !blacklistFields.includes(fieldName);
  };

  isPortableField = (fieldName: string): boolean => {
    // @ts-ignore
    return PortableBase.isPrototypeOf(this[fieldName]) || this[fieldName] instanceof PortableBase;
  };

  setValueForField(fieldName: string, value: any) {
    // @ts-ignore
    this[fieldName] = value;
  }

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

  fromObject = (obj: {[key: string]: any}) => {
    for (const key in obj) {
      if(this.isValidField(key)) {
        // @ts-ignore
        this[key] = obj[key]
      }
    }
  }

  writePortable = (output: PortableWriter) => {
    for (const key of Object.keys(this)) {
      if (this.isValidField(key)) {
        try {
          if (this.isPortableField(key)) {
            // @ts-ignore
            output.writePortable(key, this[key]);
          } else {
            // @ts-ignore
            switch (typeof this[key]) {
              case 'number': {
                // @ts-ignore
                output.writeDouble(key, this[key]);
                break;
              }
              case 'boolean': {
                // @ts-ignore
                output.writeBoolean(key, this[key]);
                break;
              }
              case 'string': {
                // @ts-ignore
                output.writeUTF(key, this[key]);
                break;
              }
              default: {
                throw new Error("No fit type");
              }
            }
          }
        } catch (e) {
          // @ts-ignore
          log.error('unable to write', key, typeof this[key], e);
        }
      }
    }
  };

  readPortable = (input: PortableReader) => {
    for (const key of Object.keys(this)) {
      if (this.isValidField(key)) {
        try {
          if (this.isPortableField(key)) {
            this.setValueForField(key, input.readPortable(key));
          } else {
             // @ts-ignore
            // @ts-ignore
            switch (typeof this[key]) {
              case 'number': {
                this.setValueForField(key, input.readDouble(key));
                break;
              }
              case 'boolean': {
                // @ts-ignore
                this.setValueForField(key, input.readBoolean(key));
                break;
              }
              case 'string': {
                this.setValueForField(key, input.readUTF(key));
                break;
              }
              default: {
                // @ts-ignore
                throw new Error("no fit type");
              }
            }
          }
        } catch(e) {
          // @ts-ignore
          log.error('unable to read', key, typeof this[key], e);
        }
      }
    }
  };
}
