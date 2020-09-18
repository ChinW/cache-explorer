import * as React from 'react';
import _ from 'lodash';
import { Environment } from 'shared/src/enums';

export const usePrevious = (value: any): any => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const extractColumns = (data: { [key: string]: any }, parent: string = ''): CacheGrid.Column[] => {
  const columns: CacheGrid.Column[] = _.keys(data).map(
    (fieldName: string): CacheGrid.Column => {
      const col: CacheGrid.Column = {
        headerName: fieldName
      };
      if (typeof data[fieldName] === 'object') {
        col.field = fieldName;
        col.children = extractColumns(data[fieldName], fieldName);
      } else {
        col.field = parent.length > 0 ? `${parent}.${fieldName}` : fieldName;
      }
      return col;
    }
  );
  return columns;
};

export const getLocationQuery = (searchString: string): SearchBar.Query => {
  let result: any = {
    env: Environment.DEV,
    map: '',
    filter: ''
  };
  if (searchString.length > 0) {
    let urlParams = new URLSearchParams(searchString.substring(1));
    urlParams.forEach((value, key) => {
      result[key] = value;
    });
  }
  return result;
};
