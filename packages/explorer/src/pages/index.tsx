import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import * as React from "react";
import _ from "lodash";
import { AgGridReact } from "ag-grid-react";
import styles from "./index.module.scss";
import { objectToQueryString } from "shared/src/utils";
import { Ws } from "../lib/websocket";

interface Column {
  headerName: string;
  field: string;
}

interface Props {
  defaultQuery: CacheQuery;
  data: Array<any>;
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

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  return {
    props: {
      defaultQuery: {
        env: "dev",
        map: "",
        filter: "",
      },
      data: [],
    },
  };
};

export default (props: Props) => {
  const selectEl = React.useRef(null);
  const mapEl = React.useRef(null);
  const filterEl = React.useRef(null);
  const router = useRouter();
  const [state, dispatch] = React.useReducer((state: Props, action: { type: string; data: any }) => {
    switch (action.type) {
      case "newData": {
        return Object.assign({}, state, {
          data: state.data.concat(action.data),
        });
      }
      case "initData": {
        return Object.assign({}, state, {
          data: action.data,
        });
      }
      default:
        return state;
    }
  }, props);
  const query = Object.assign({}, props.defaultQuery, router.query);
  const search = async () => {
    const env = selectEl.current.value;
    const map = mapEl.current.value || "";
    const filter = filterEl.current.value || "";
    router.push(
      `/?${objectToQueryString({
        env,
        map,
        filter,
      })}`,
      undefined,
      { shallow: true }
    );
  };

  const wsSetup = async (ws: Ws) => {
    dispatch({
      type: "initData",
      data: []
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

  React.useEffect(() => {
    const ws = new Ws();
    wsSetup(ws);
    return () => {
      ws.close();
    };
  }, [router.query, dispatch]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className={`flex flex-row ${styles.searchBar}`}>
        <select className="text-gray-700 text-xs mr-1 shadow borded" name="env" defaultValue={query.env} ref={selectEl}>
          <option value={"prod"}>PROD</option>
          <option value={"qa"}>QA</option>
          <option value={"dev"}>DEV</option>
        </select>
        <div className={styles.filterItem}>
          <label htmlFor="">Map</label>
          <input type="text" ref={mapEl} defaultValue={query.map} />
        </div>
        <div className={`${styles.filterItem} flex-grow`}>
          <label htmlFor="">Filters</label>
          <input type="text" ref={filterEl} defaultValue={query.filter} className="flex-grow" />
        </div>
        <button className="btn btn-xs btn-blue" onClick={search}>
          Go
        </button>
      </div>
      <div className={`flex-grow ag-theme-alpine`}>
        <AgGridReact columnDefs={extractColumns(state.data)} rowData={state.data}></AgGridReact>
      </div>
    </div>
  );
};
