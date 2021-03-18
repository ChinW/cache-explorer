import _ from 'lodash';
import * as React from 'react';
import { Chart } from '@antv/g2';
import { CacheWebsocket } from 'app/lib/cacheWebsocket';
import { useLocation } from 'react-router';
import { getLocationQuery, object2Table } from '../../lib/utils';
import { Formatter } from 'app/utils/formatter';
import { METRIC_CONFIG, setUpChart } from './benchmark.charts'

const dataEnrich = (data: Benchmark.Metric, wraps: any[], pct: number): Benchmark.Metric => {
  data.wrapItems = wraps.length;
  data.positionPct = pct / 100;
  return data;
};

const dataClean = (data: Benchmark.Metric[]): Benchmark.Metric[] => {
  const chunkSize = 500;
  if (data.length < chunkSize) {
    return _.sortBy(data, 'timeCost').map((item, index) => dataEnrich(item, [], (index + 1) / data.length));
  } else {
    const chunks = _.chunk(_.sortBy(data, 'timeCost'), data.length / chunkSize);
    const result: Benchmark.Metric[] = chunks.map((chunk, chunkIndex) => {
      return dataEnrich(
        {
          createdAt: parseInt((_.sumBy(chunk, 'createdAt') / chunk.length) as any),
          timeCost: _.sumBy(chunk, 'timeCost') / chunk.length
        },
        chunk,
        (chunkIndex + 1) / chunks.length
      );
    });
    return result;
  }
};

const mockDataGenerator = (): Benchmark.Metric[] => {
  const data: any =  _.times(200000).map((index) => {
    return {
      createdAt: Date.now() + parseInt((index * 1000) as any),
      timeCost: parseInt((Math.random() * 500).toString(), 10),
    };
  });
  return dataClean(data);
};

const mockData = mockDataGenerator();

const initialState: Benchmark.Props = {
  websocket: new CacheWebsocket(),
  data: mockData,
  chart: {}
};

export const stateReducer = (prevState: Benchmark.Props, action: Benchmark.StateAction) => {
  switch (action.type) {
    case 'initData': {
      return Object.assign({}, prevState, {
        data: _.unionBy(action.data.add, action.data.update, (i: any) => i.nid)
      });
    }
    case 'setChart': {
      return _.merge({}, prevState, {
        chart: {
          [action.data.name]: action.data.value
        }
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
    // const initWebsocket = async () => {
    //   await websocket.init(locationQuery.env, window.location);
    //   websocket.subscribeOnMessage((response: any) => {
    //     dispatch(response);
    //   });
    //   websocket.subscribeMap(CacheMap.OrderSourceA.name, locationQuery.filter);
    // };
    // initWebsocket();
    // return () => {
    //   websocket.close();
    // };
  }, [dispatch, locationQuery.env]);

  React.useLayoutEffect(() => {
    dispatch({
      type: 'setChart',
      data: {
        name: 'cost',
        value: new Chart({
          container: 'time-cost-perf',
          autoFit: true,
          height: 350,
        })
      }
    });
    dispatch({
      type: 'setChart',
      data: {
        name: 'line',
        value: new Chart({
          container: 'time-series-perf',
          autoFit: true,
          height: 350
        })
      }
    });
  }, []);
  React.useLayoutEffect(() => {
    if (state.chart.cost && state.data.length > 0) {
      console.log("comes to here", state.data)
      setUpChart(state.chart.cost, state.data, {
        x: METRIC_CONFIG.TIME_COST,
        y: METRIC_CONFIG.POSITION_PCT,
      })
    }
    if (state.chart.line) {
    }
  }, [state.data, state.chart]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="pl-5 pt-5">{calculateBenchmarkIndicator(state.data)}</div>
      <div id="time-cost-perf" className="px-5 pt-5" />
      <div id="time-series-perf" className="px-5 pt-5" />
    </div>
  );
};
