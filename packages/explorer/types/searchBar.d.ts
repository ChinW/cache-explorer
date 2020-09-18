/// <reference types="react" />

declare namespace SearchBar {
  interface Query {
    env: import('shared/src/enums').Environment;
    map: string;
    filter: string;
  }

  interface Props {
    query: Query;
  }
}
