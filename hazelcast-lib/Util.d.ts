/// <reference types="node" />
/// <reference types="bluebird" />
import * as Promise from 'bluebird';
import { PagingPredicate } from './serialization/DefaultPredicates';
import { Address } from './Address';
export declare function assertNotNull(v: any): void;
export declare function assertArray(x: any): void;
export declare function assertString(v: any): void;
export declare function shuffleArray<T>(array: T[]): void;
export declare function assertNotNegative(v: number, message?: string): void;
export declare function getType(obj: any): string;
export declare function enumFromString<T>(enumType: any, value: string): T;
export declare function getSortedQueryResultSet(list: any[], predicate: PagingPredicate): any[];
export declare function copyObjectShallow<T>(obj: T): T;
export declare function tryGetBoolean(val: any): boolean;
export declare function tryGetNumber(val: any): number;
export declare function tryGetArray(val: any): any[];
export declare function tryGetString(val: any): string;
export declare function getStringOrUndefined(val: any): string;
export declare function getBooleanOrUndefined(val: any): boolean;
export declare function tryGetEnum<T>(enumClass: any | {
    [index: string]: number;
}, str: string): T;
export declare function resolvePath(path: string): string;
export declare function loadNameFromPath(path: string, exportedName: string): any;
export declare class AddressHelper {
    private static readonly MAX_PORT_TRIES;
    private static readonly INITIAL_FIRST_PORT;
    static getSocketAddresses(address: string): Address[];
    static createAddressFromString(address: string, defaultPort?: number): Address;
}
export declare function mergeJson(base: any, other: any): void;
/**
 * Returns a random integer between 0(inclusive) and `upperBound`(exclusive)
 * Upper bound should be an integer.
 * @param upperBound
 * @returns A random integer between [0-upperBound)
 */
export declare function randomInt(upperBound: number): number;
export declare class Task {
    intervalId: NodeJS.Timer;
    timeoutId: NodeJS.Timer;
}
export declare function scheduleWithRepetition(callback: (...args: any[]) => void, initialDelay: number, periodMillis: number): Task;
export declare function cancelRepetitionTask(task: Task): void;
export declare function DeferredPromise<T>(): Promise.Resolver<T>;
export declare function getNodejsMajorVersion(): number;
export declare function pad(str: string, targetLength: number, padString: string): string;