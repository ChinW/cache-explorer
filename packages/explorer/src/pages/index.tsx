import _ from "lodash";
import { useRouter } from "next/router";
import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import { GridReadyEvent } from "ag-grid-community";
import { SearchBar } from "../components/searchBar";
import { Env, WsRequestType, WsResponseType } from "shared/src/enums";
import { Ws } from "../lib/websocket";
import { extractColumns } from "../lib/utils";

const initialState: WsExplorer.Props = {
  request: null,
  response: null,
  data: [],
};

export const wsDataReducer = (state: WsExplorer.Props, action: WSS.Response) => {
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

export default (props: WsExplorer.Props) => {
  const router = useRouter();
  const [gridColumnApi, setGridColumnApi] = React.useState(null);
  const [state, dispatch] = React.useReducer(wsDataReducer, initialState);

  const query = Object.assign({
    env: Env.Dev,
    map: "",
    filter: "",
  }, router.query);

  React.useEffect(() => {
    const ws = new Ws();
    const wsSetup = async (ws: Ws) => {
      dispatch({
        type: WsResponseType.InitData,
        data: [],
      });
      await ws.init();
      ws.subscribeMap(query.map, query.filter);
      ws.subscribeOnMessage((response: WSS.Response) => {
        dispatch(response);
      });
    };
    wsSetup(ws);
    return () => {
      ws.close();
    };
  }, [router.query, dispatch]);

  React.useEffect(() => {
    console.log(state.response, gridColumnApi)
    if (state.response && state.response.type === WsResponseType.InitData && gridColumnApi) {
      console.log("set data")
      gridColumnApi.autoSizeAllColumns();
    }
  }, [state.response]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridColumnApi(params.columnApi);
    params.columnApi.autoSizeAllColumns();
  };

  return (
    <div className="flex flex-col w-full h-full">
      <SearchBar query={query} />
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
        />
      </div>
    </div>
  );
};
