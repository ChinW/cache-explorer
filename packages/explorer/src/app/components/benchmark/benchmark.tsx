import _ from 'lodash';
import * as React from 'react';
import { Chart } from '@antv/g2';
import { CacheWebsocket } from 'app/lib/cacheWebsocket';
import { useLocation } from 'react-router';
import { getLocationQuery, object2Table } from '../../lib/utils';
import { CacheMap } from 'shared/src/cache/cacheMap';
import moment from 'moment';

const initialState: Benchmark.Props = {
  websocket: new CacheWebsocket(),
  data: [],
  chart: undefined
};

export const stateReducer = (prevState: Benchmark.Props, action: Benchmark.StateAction) => {
  switch (action.type) {
    case 'initData': {
      return Object.assign({}, prevState, {
        data: _.unionBy(action.data.add, action.data.update, (i: any) => i.nid)
      });
    }
    case 'setChart': {
      return Object.assign({}, prevState, {
        chart: action.data
      });
    }
    default:
      return prevState;
  }
};

const calculateBenchmarkIndicator = (data: any[]): JSX.Element => {
  const timeRangeField = 'createdAt';
  const totalOrders = 1000;
  const totalTime = _.get(_.maxBy(data, timeRangeField), timeRangeField, 0) - _.get(_.minBy(data, timeRangeField), timeRangeField, 0);
  const avgMatchLatency = totalTime / totalOrders;
  console.log('totalTimeCost', totalTime);
  const result: any[] = [
    { name: 'Total Order Events', value: 1000 },
    { name: 'Total Time Range', value: totalTime },
    { name: 'Avg Match Latency', value: avgMatchLatency.toFixed(3) },
    { name: 'Avg Reuslted Item Latency', value: (_.sumBy(data, 'timeCost') / data.length).toFixed(3) }
  ];
  return object2Table(result);
};

export const Benchmark = (props: Benchmark.Props) => {
  const location = useLocation();
  const locationQuery = getLocationQuery(location.search);
  const [state, dispatch] = React.useReducer(stateReducer, initialState);
  const { websocket } = state;
  React.useEffect(() => {
    const initWebsocket = async () => {
      await websocket.init(locationQuery.env, window.location);
      websocket.subscribeOnMessage((response: any) => {
        dispatch(response);
      });
      websocket.subscribeMap(CacheMap.OrderSourceA.name, locationQuery.filter);
    };
    initWebsocket();
    return () => {
      websocket.close();
    };
  }, [dispatch, locationQuery.env]);

  React.useLayoutEffect(() => {
    dispatch({
      type: 'setChart',
      data: new Chart({
        container: 'order-perf',
        autoFit: true,
        height: 350
      })
    });
  }, []);
  React.useLayoutEffect(() => {
    if (state.chart) {
      state.chart.data(state.data);
      state.chart.scale('createdAt', {
        formatter: (v: number) => {
          return moment(v).format('HH:MM:SS.SSS');
        }
      });
      state.chart.scale('timeCost', {
        nice: true,
        formatter: (v: number) => {
          return v + 'ms';
        }
      });
      state.chart.interval().position('createdAt*timeCost');
      state.chart.render();
    }
  }, [state.data]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="pl-5 pt-5">
      {calculateBenchmarkIndicator(state.data)}
      </div>
      <div id="order-perf" className="px-5 pt-5" />
    </div>
  );
};
