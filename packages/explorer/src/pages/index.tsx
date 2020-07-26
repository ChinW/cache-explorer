import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import * as React from "react";
import _ from "lodash";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import { GridReadyEvent, GridApi, ColumnApi } from "ag-grid-community";
import { SearchBar } from "../components/searchBar";
import { Env } from "shared/src/constants";
import { Ws } from "../lib/websocket";

interface Column {
  headerName: string;
  field: string;
}

interface Props {
  action: string;
  query: CacheQuery;
  data: Array<any>;
  gridApi?: GridApi;
  gridColumnApi?: ColumnApi;
}

const extractColumns = (data: any[]): Column[] => {
  const columns: Column[] = _.union(...data.map((i) => Object.keys(i))).map(
    (i: string): Column => {
      return {
        headerName: i,
        field: i,
      };
    }
  );
  return columns;
};

const initialState: Props = {
  action: "",
  query: {
    env: Env.Dev,
    map: "",
    filter: "",
  },
  data: [],
  gridApi: null,
  gridColumnApi: null,
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  return {
    props: initialState,
  };
};

export const usePrevious = (value): any => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const wsDataReducer = (state: Props, action: { type: string; data: any }) => {
  switch (action.type) {
    case "newData": {
      return Object.assign({}, state, {
        action: action.type,
        data: state.data.concat(action.data),
      });
    }
    case "initData": {
      return Object.assign({}, state, {
        action: action.type,
        data: action.data,
      });
    }
    case "setGridApi": {
      return Object.assign({}, state, {
        action: action.type,
        gridApi: action.data,
      });
    }
    case "setGridColumnApi": {
      return Object.assign({}, state, {
        action: action.type,
        gridColumnApi: action.data,
      });
    }
    default:
      return state;
  }
}

export default (props: Props) => {
  const router = useRouter();
  const [query, setQuery] = React.useState(
    Object.assign(
      {
        env: Env.Dev,
        map: "",
        filter: "",
      },
      router.query
    )
  );
  const [gridApi, setGridApi] = React.useState(props.gridApi);
  const [gridColumnApi, setGridColumnApi] = React.useState(props.gridColumnApi);
  const [state, dispatch] = React.useReducer(wsDataReducer, initialState);
  const prevState = usePrevious(state);

  React.useEffect(() => {
    const ws = new Ws();
    const wsSetup = async (ws: Ws) => {
      dispatch({
        type: "initData",
        data: [],
      });
      await ws.init();
      ws.subscribeMap(query.env, query.map, query.filter);
      ws.subscribeOnMessage((newData) => {
        dispatch({
          type: "newData",
          data: newData,
        });
      });
    };
    wsSetup(ws);
    return () => {
      ws.close();
    };
  }, [query, dispatch]);

  React.useEffect(() => {
    if (state.action === "newData" && state.gridColumnApi) {
      state.gridColumnApi.autoSizeAllColumns();
    }
  }, [state]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    dispatch({
      type: "setGridApi",
      data: params.api,
    });
    dispatch({
      type: "setGridColumnApi",
      data: params.columnApi,
    });
    params.columnApi.autoSizeAllColumns();
  };

  return (
    <div className="flex flex-col w-full h-full">
      <SearchBar query={query} setQuery={setQuery} />
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
