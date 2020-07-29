/// <reference types="react" />

declare namespace SearchBar {
  interface Query {
    env: import('shared/src/enums').Env;
    map: string;
    filter: string;
  }
  interface Props {
    query: Query;
    navigate: any;
    // nagative: import("@reach/router").NavigateFn
  }
}
