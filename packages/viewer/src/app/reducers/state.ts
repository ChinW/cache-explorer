import { TodoModel } from 'app/models';

export interface RootState {
  router?: any;
}

export namespace RootState {
  export type TodoState = TodoModel[];
}
