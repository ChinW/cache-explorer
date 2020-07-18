/// <reference types="long" />
import Long = require('long');
import { Address } from '../../Address';
export declare class Message<T> {
    messageObject: T;
    publisher: Address;
    publishingTime: Long;
}
