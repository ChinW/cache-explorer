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
        headerName: fieldName,
        filter: true
      };
      col.field = parent.length > 0 ? `${parent}.${fieldName}` : fieldName;
      if (data[fieldName] && typeof data[fieldName] === 'object') {
        col.children = extractColumns(data[fieldName], col.field);
        if (col.children.length === 0) {
          delete col.children;
        }
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

export const object2Table = (data: any[]): JSX.Element => {
  return (
    <table className="border-collapse border-2 border-gray-500">
      <tbody>
        {data.map((item) => {
          return (
            <tr key={item.name}>
              <td className="border border-gray-400 px-2 py-1">{item.name}</td>
              <td className="border border-gray-400 px-2 py-1 text-right">{item.value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
