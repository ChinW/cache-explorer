import _ from 'lodash';
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import { GridReadyEvent, ColumnApi, GridApi } from 'ag-grid-community';
import { SearchBar } from '../searchbar/searchBar';
import { WsResponseAction } from 'shared/src/enums';
import { CacheWebsocket } from '../../lib/cacheWebsocket';
import { extractColumns, getLocationQuery } from '../../lib/utils';
import { Order } from 'shared/src/types/order';
import { useLocation } from 'react-router';

const initialState: Explorer.Props = {
  response: undefined,
  websocket: new CacheWebsocket()
};

export const wsDataReducer = (state: Explorer.Props, response: StreamServer.Response) => {
  switch (response.type) {
    case WsResponseAction.DeltaData: {
      return Object.assign({}, state, {
        response
      });
    }
    case WsResponseAction.InitData: {
      return Object.assign({}, state, {
        response
      });
    }
    default:
      return state;
  }
};

export const Explorer = (props: Explorer.Props) => {
  const location = useLocation();
  const locationQuery = getLocationQuery(location.search);
  const [gridColumns, setGridColumns] = React.useState<CacheGrid.Column[]>([]);
  const [gridColumnApi, setGridColumnApi] = React.useState<ColumnApi>();
  const [gridApi, setGridApi] = React.useState<GridApi>();
  const [state, dispatch] = React.useReducer(wsDataReducer, initialState);
  const { websocket } = state;

  React.useEffect(() => {
    const initWebsocket = async () => {
      setGridColumns([]);
      // if (gridApi) {
      //   gridApi.setRowData([]); // fixme
      // }
      await websocket.init(locationQuery.env);
      websocket.subscribeOnMessage((response: StreamServer.Response) => {
        dispatch(response);
      });
      websocket.subscribeMap(locationQuery.map, locationQuery.filter);
    };
    initWebsocket();
    return () => {
      websocket.close();
    };
  }, [dispatch, locationQuery.env]);

  React.useEffect(() => {
    if (websocket.socket?.readyState === WebSocket.OPEN) {
      websocket.subscribeMap(locationQuery.map, locationQuery.filter);
    }
    return () => {};
  }, [locationQuery.map, locationQuery.filter]);

  React.useEffect(() => {
    if (state.response && gridColumnApi && gridApi) {
      gridApi.applyTransaction(state.response.data);
      if (state.response.type === WsResponseAction.InitData) {
        gridColumnApi.autoSizeAllColumns();
        if (state.response.data.add.length > 0) {
          setGridColumns(extractColumns(_.get(state, 'response.data.add[0]', {})));
        }
      }
    }
  }, [state.response]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridColumnApi(params.columnApi);
    setGridApi(params.api);
    params.columnApi.autoSizeAllColumns();
  };

  return (
    <div className="flex flex-col w-full h-full">
      <SearchBar query={locationQuery} />
      <div className={`flex-grow ag-theme-alpine`}>
        <AgGridReact
          columnDefs={gridColumns}
          defaultColDef={{
            resizable: true,
            sortable: true,
            enablePivot: true,
            enableRowGroup: true
          }}
          sideBar={true}
          enableRangeSelection={true}
          enableCellChangeFlash={true}
          statusBar={{
            statusPanels: [
              {
                statusPanel: 'agTotalAndFilteredRowCountComponent',
                align: 'left'
              },
              {
                statusPanel: 'agTotalRowCountComponent',
                align: 'center'
              },
              { statusPanel: 'agFilteredRowCountComponent' },
              { statusPanel: 'agSelectedRowCountComponent' },
              { statusPanel: 'agAggregationComponent' }
            ]
          }}
          rowGroupPanelShow={'always'}
          pivotPanelShow={'always'}
          pivotColumnGroupTotals={'after'}
          pivotRowTotals={'before'}
          onGridReady={onGridReady}
          deltaRowDataMode={true}
          getRowNodeId={(data: Order) => {
            return data.id;
          }}
        />
      </div>
    </div>
  );
};
