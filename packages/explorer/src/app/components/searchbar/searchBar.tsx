import React, { useRef } from 'react';
import { objectToQueryString } from 'shared/src/utils';
import { Environment } from 'shared/src/enums';
import styles from './searchBar.module.scss';
import { useHistory } from 'react-router';
import { CacheMap } from 'shared/src/types/cacheMap';

export const SearchBar = (props: SearchBar.Props) => {
  const history = useHistory();
  const { query } = props;
  const selectEl = useRef<HTMLSelectElement | null>();
  const mapEl = useRef<HTMLSelectElement | null>();
  const filterEl = useRef<HTMLInputElement | null>();
  const search = async () => {
    const env = selectEl.current?.value;
    const map = mapEl.current?.value || '';
    const filter = filterEl.current?.value || '';
    history.push(
      `/?${objectToQueryString({
        env,
        map,
        filter
      })}`
    );
  };
  return (
    <div className={`flex flex-row ${styles.searchBar}`}>
      <div className={styles.filterItem}>
        <label>Environment</label>
        <select
          className="text-gray-700 h-full bg-blue-100 text-xs mr-1 shadow borded"
          name="env"
          defaultValue={query.env}
          ref={(dom) => (selectEl.current = dom)}
        >
          {Object.keys(Environment).map((env) => {
            return (
              <option key={env} value={Environment[env as keyof typeof Environment]}>
                {env}
              </option>
            );
          })}
        </select>
      </div>
      <div className={styles.filterItem}>
        <label>Cache</label>
        <select
          className="text-gray-700 h-full bg-blue-100 text-xs mr-1 shadow borded"
          name="env"
          defaultValue={query.map}
          ref={(dom) => (mapEl.current = dom)}
        >
          {Object.values(CacheMap).map((cache) => {
            return (
              <option key={cache.name} value={cache.name}>
                {cache.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className={`${styles.filterItem} flex-grow`}>
        <label>Filter</label>
        <input type="text" ref={(dom) => (filterEl.current = dom)} defaultValue={query.filter} className="flex-grow bg-blue-100" />
      </div>
      <button className="btn btn-xs btn-blue" onClick={search}>
        Go
      </button>
    </div>
  );
};
