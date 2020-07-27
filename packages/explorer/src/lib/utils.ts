import * as React from "react";

export const usePrevious = (value: any): any => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const extractColumns = (data: any[]): CacheGrid.Column[] => {
  const columns: CacheGrid.Column[] = _.union(...data.map((i) => Object.keys(i))).map(
    (i: string): CacheGrid.Column => {
      return {
        headerName: i,
        field: i,
      };
    }
  );
  return columns;
};
