import styles from "./searchBar.module.scss";
import * as React from "react";
import { useRouter } from "next/router";
import { objectToQueryString } from "shared/src/utils";
import { Dispatch, SetStateAction } from "react";

interface Props {
  query: CacheQuery;
  setQuery: Dispatch<SetStateAction<CacheQuery>>;
}

export const MAP_LIST = ["city_weather", "orders", "others"];

export const SearchBar = (props: Props) => {
  const selectEl = React.useRef(null);
  const mapEl = React.useRef(null);
  const filterEl = React.useRef(null);
  const router = useRouter();
  const { query, setQuery } = props;
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
    setQuery({
      env,
      map,
      filter,
    });
  };

  return (
    <div className={`flex flex-row ${styles.searchBar}`}>
      <select className="text-gray-700 text-xs mr-1 shadow borded" name="env" defaultValue={query.env} ref={selectEl}>
        <option value={"prod"}>PROD</option>
        <option value={"qa"}>QA</option>
        <option value={"dev"}>DEV</option>
      </select>
      <div className={styles.filterItem}>
        <label htmlFor="">Map</label>
        <select className="text-gray-700 text-xs mr-1 shadow borded" name="env" defaultValue={query.map} ref={mapEl}>
          {MAP_LIST.map((map) => {
            return <option key={map} value={map}>{map}</option>;
          })}
        </select>
      </div>
      <div className={`${styles.filterItem} flex-grow`}>
        <label htmlFor="">Filters</label>
        <input type="text" ref={filterEl} defaultValue={query.filter} className="flex-grow" />
      </div>
      <button className="btn btn-xs btn-blue" onClick={search}>
        Go
      </button>
    </div>
  );
};
