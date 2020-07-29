import _ from "lodash";
import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import { GridReadyEvent } from "ag-grid-community";
import { SearchBar } from "../components/searchBar";
import { Env, WsRequestType, WsResponseType } from "shared/src/enums";
import { Ws } from "../lib/websocket";
import { extractColumns, getSearch } from "../lib/utils";
import { PageProps } from "gatsby";
import { Order } from "shared/src/cache/order";

const initialState: WsExplorer.Props = {
  request: null,
  response: null,
  data: [],
  ws: new Ws(),
};

export const wsDataReducer = (
  state: WsExplorer.Props,
  action: WSS.Response
) => {
  switch (action.type) {
    case WsResponseType.DeltaData: {
      return Object.assign({}, state, {
        response: action,
        data: state.data.concat(action.data),
      });
    }
    case WsResponseType.InitData: {
      return Object.assign({}, state, {
        response: action,
        data: action.data,
      });
    }
    default:
      return state;
  }
};

export default (props: WsExplorer.Props & PageProps) => {
  const query = getSearch(props.location.search);
  const [gridColumnApi, setGridColumnApi] = React.useState(null);
  const [state, dispatch] = React.useReducer(wsDataReducer, initialState);

  React.useEffect(() => {
    console.log("entering A");
    const initWs = async () => {
      await state.ws.init();
      return new Promise(resolve => {
        setTimeout(() => {
          console.log("done");
          resolve(1);
        }, 2000);
        state.ws.subscribeOnMessage((response: WSS.Response) => {
          dispatch(response);
        });
      });
    };
    initWs();
    return () => {
      state.ws.close();
    };
  }, [dispatch]);

  React.useEffect(() => {
    if (state.ws.socket && state.ws.socket.readyState === WebSocket.OPEN) {
      state.ws.subscribeMap(query.map, query.filter);
    }
  }, [state.ws.socket, props.location]);

  React.useEffect(() => {
    console.log(state.response, gridColumnApi);
    if (
      state.response &&
      state.response.type === WsResponseType.InitData &&
      gridColumnApi
    ) {
      gridColumnApi.autoSizeAllColumns();
    }
  }, [state.response]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridColumnApi(params.columnApi);
    params.columnApi.autoSizeAllColumns();
  };

  return (
    <div className="flex flex-col w-full h-full">
      <SearchBar query={query} nagative={props.navigate} />
      <div className={`flex-grow ag-theme-alpine`}>
        <AgGridReact
          columnDefs={extractColumns(state.data)}
          defaultColDef={{
            resizable: true,
            sortable: true,
            enablePivot: true,
            enableRowGroup: true,
          }}
          sideBar={true}
          enableRangeSelection={true}
          statusBar={{
            statusPanels: [
              {
                statusPanel: "agTotalAndFilteredRowCountComponent",
                align: "left",
              },
              {
                statusPanel: "agTotalRowCountComponent",
                align: "center",
              },
              { statusPanel: "agFilteredRowCountComponent" },
              { statusPanel: "agSelectedRowCountComponent" },
              { statusPanel: "agAggregationComponent" },
            ],
          }}
          rowGroupPanelShow={"always"}
          pivotPanelShow={"always"}
          pivotColumnGroupTotals={"after"}
          pivotRowTotals={"before"}
          rowData={state.data}
          onGridReady={onGridReady}
          deltaRowDataMode={true}
          getRowNodeId={(data: Order) => {
            return data.city;
          }}
        />
      </div>
    </div>
  );
};
