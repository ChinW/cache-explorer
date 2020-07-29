import * as React from "react";
import { objectToQueryString } from "shared/src/utils";
import { WsRequestType, Env } from "shared/src/enums";
import styles from "./searchBar.module.scss";

export const MAP_LIST = ["", "city_weather", "orders", "others"];
export const ENVIRONMENTS = [Env.Prod, Env.QA, Env.Dev];

export const SearchBar = (props: SearchBar.Props) => {
  console.log(props);
  const selectEl = React.useRef(null);
  const mapEl = React.useRef(null);
  const filterEl = React.useRef(null);
  const router = {
    query: {
      env: Env.Dev,
      map: "",
      filter: "",
    },
  };
  const { query } = props;
  const search = async () => {
    const env = selectEl.current.value;
    const map = mapEl.current.value || "";
    const filter = filterEl.current.value || "";
    // props.nagative(
    //   `/?${objectToQueryString({
    //     env,
    //     map,
    //     filter,
    //   })}`
    // );
  };

  return (
    <div className={`flex flex-row ${styles.searchBar}`}>
      <div className={styles.filterItem}>
        <label htmlFor="">Env</label>
        <select
          className="text-gray-700 h-full bg-blue-100 text-xs mr-1 shadow borded"
          name="env"
          defaultValue={query.env}
          ref={selectEl}
        >
          {ENVIRONMENTS.map(env => {
            return (
              <option key={env} value={env}>
                {env}
              </option>
            );
          })}
        </select>
      </div>
      <div className={styles.filterItem}>
        <label htmlFor="">Map</label>
        <select
          className="text-gray-700 h-full bg-blue-100 text-xs mr-1 shadow borded"
          name="env"
          defaultValue={query.map}
          ref={mapEl}
        >
          {MAP_LIST.map(map => {
            return (
              <option key={map} value={map}>
                {map}
              </option>
            );
          })}
        </select>
      </div>
      <div className={`${styles.filterItem} flex-grow`}>
        <label htmlFor="">Filters</label>
        <input
          type="text"
          ref={filterEl}
          defaultValue={query.filter}
          className="flex-grow bg-blue-100"
        />
      </div>
      <button className="btn btn-xs btn-blue" onClick={search}>
        Go
      </button>
    </div>
  );
};
