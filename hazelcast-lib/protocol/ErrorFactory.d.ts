import { ClientMessage } from '../ClientMessage';
import { ErrorHolder } from './ErrorHolder';
export declare class ClientErrorFactory {
    private codeToErrorConstructor;
    constructor();
    createErrorFromClientMessage(clientMessage: ClientMessage): Error;
    createError(errorHolders: ErrorHolder[], errorHolderIdx: number): Error;
    private register(code, errorFactory);
}
