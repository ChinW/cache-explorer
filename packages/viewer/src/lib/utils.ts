import * as React from "react";
import _ from "lodash";
import { Env } from "shared/src/enums";

export const usePrevious = (value: any): any => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const extractColumns = (data: any[]): CacheGrid.Column[] => {
  const columns: CacheGrid.Column[] = _.union(
    ...data.map(i => Object.keys(i))
  ).map(
    (i: string): CacheGrid.Column => {
      return {
        headerName: i,
        field: i,
      };
    }
  );
  return columns;
};

export const getSearch = (searchString: string): SearchBar.Query => {
  let result = {
    env: Env.Dev,
    map: "",
    filter: "",
  };
  if (searchString.length > 0) {
    let urlParams = new URLSearchParams(searchString.substring(1));
    const entries = urlParams.entries();
    for (let entry of entries) {
      const [key, value] = entry;
      result[key] = value;
    }
  }
  return result;
};
