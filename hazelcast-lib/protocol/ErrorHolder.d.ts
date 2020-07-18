import { StackTraceElement } from './StackTraceElement';
export declare class ErrorHolder {
    errorCode: number;
    className: string;
    message: string;
    stackTraceElements: StackTraceElement[];
    constructor(errorCode: number, className: string, message: string, stackTraceElements: StackTraceElement[]);
}
