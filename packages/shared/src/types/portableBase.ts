import { PortableReader, PortableWriter, Portable } from 'hazelcast-client';
import { log } from '../logger';
import { FACTORY_ID, CACHE_TYPE_CLASS_ID } from '../cache/cacheConstants';

export abstract class PortableBase implements Portable {
  factoryId: number = FACTORY_ID;
  classId: number;
  nxid: string = '';

  constructor(classId: CACHE_TYPE_CLASS_ID) {
    this.classId = classId;
  }

  abstract getIdentity(): string;

  isValidField = (field: string): boolean => {
    const value = this.getThis(field);
    const blacklistFields = ['nxid', 'factoryId', 'classId'];
    return typeof value !== 'function' && !blacklistFields.includes(field);
  };

  isPortable = (value: any): boolean => {
    return PortableBase.isPrototypeOf(value) || value instanceof PortableBase;
  };

  // @ts-ignore
  isPortableField = (field: string): boolean => this.isPortable(this[field]);

  setValue = (field: string, value: any) => {
    // @ts-ignore
    this[field] = value;
  };

  getThis = (field: string) => {
    // @ts-ignore
    return this[field];
  };

  toObject = () => {
    const obj: any = {};
    for (const key of Object.keys(this)) {
      if (this.isValidField(key)) {
        const value = this.getThis(key);
        if (this.isPortableField(key)) {
          obj[key] = value.toObject();
        } else if (Array.isArray(value)) {
          obj[key] = value.map((v) => {
            if (this.isPortable(v)) {
              return v.toObject();
            }
            return v;
          });
        } else {
          obj[key] = value;
        }
      }
    }
    return obj;
  };

  acceptUpdate = (obj: Dict) => {
    for (const key in obj) {
      if (this.isValidField(key)) {
        this.setValue(key, obj[key]);
      } else {
        throw TypeError(`Unable to conver field: ${key}`);
      }
    }
  };

  writePortable = (output: PortableWriter) => {
    for (const key of Object.keys(this)) {
      if (this.isValidField(key)) {
        const value = this.getThis(key);
        try {
          if (this.isPortableField(key)) {
            output.writePortable(key, value);
          } else {
            switch (typeof value) {
              case 'number': {
                output.writeDouble(key, value);
                break;
              }
              case 'boolean': {
                output.writeBoolean(key, value);
                break;
              }
              case 'string': {
                output.writeUTF(key, value);
                break;
              }
              case 'object': {
                if (value.length > 0) {
                  if (this.isPortable(value[0])) {
                    output.writePortable(key, value);
                  } else {
                    switch (typeof value[0]) {
                      case 'number': {
                        output.writeDoubleArray(key, value);
                        break;
                      }
                      case 'boolean': {
                        output.writeBooleanArray(key, value);
                        break;
                      }
                      case 'string': {
                        output.writeUTFArray(key, value);
                        break;
                      }
                      default: {
                        throw new Error('No fit type');
                      }
                    }
                  }
                }
              }
              default: {
                throw new Error('No fit type');
              }
            }
          }
        } catch (e) {
          log.error('unable to write: %s, %s, %s', key, typeof this.getThis(key), e);
        }
      }
    }
    output.writeUTF('nxid', this.getIdentity());
  };

  readPortable = (input: PortableReader) => {
    for (const key of Object.keys(this)) {
      if (this.isValidField(key)) {
        try {
          if (this.isPortableField(key)) {
            this.setValue(key, input.readPortable(key));
          } else {
            switch (typeof this.getThis(key)) {
              case 'number': {
                this.setValue(key, input.readDouble(key));
                break;
              }
              case 'boolean': {
                this.setValue(key, input.readBoolean(key));
                break;
              }
              case 'string': {
                this.setValue(key, input.readUTF(key));
                break;
              }
              case 'object': {
                this.setValue(key, input.readPortableArray(key));
                break;
              }
              default: {
                throw new Error('no fit type');
              }
            }
          }
        } catch (e) {
          log.error('Unable to read: %s, %s, %s', key, typeof this.getThis(key), e);
        }
      }
    }
    this.setValue('nxid', input.readUTF('nxid'));
  };
}
