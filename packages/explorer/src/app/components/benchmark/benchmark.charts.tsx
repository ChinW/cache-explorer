import _ from 'lodash';
import { Chart } from '@antv/g2';
type MetricConfig = {
  NAME: string;
  SCALE: any;
  AXIS: any;
}

export const METRIC_CONFIG: {
  [key: string]: MetricConfig
} = {
  CREATED_AT: {
    NAME: 'createdAt',
    SCALE: {
      nice: true,
      type: 'timeCat',
      mask: 'HH:mm:ss',
      alias: 'Timeline'
    },
    AXIS: {
      x: {
        title: {
          offset: 30
        }
      },
      y: {
        title: {
          offset: 100
        }
      }
    }
  },
  TIME_COST: {
    NAME: 'timeCost',
    SCALE: {
      alias: 'Time Cost (ms)',
      formater: (v: number) => v 
    },
    AXIS: {
      x: {
        title: {
          offset: 30
        }
      },
      y: {
        title: {
          offset: 100
        }
      }
    }
  },
  POSITION_PCT: {
    NAME: 'positionPct',
    SCALE: {
      alias: 'Position Pct %',
      formater: (v: number) => v 
    },
    AXIS: {
      x: {
        title: {
          offset: 30
        }
      },
      y: {
        title: {
          offset: 100
        }
      }
    }
  }
}


export const setUpChart = (
  chart: Chart | null,
  data: Benchmark.Metric[],
  config: {
    x: MetricConfig,
    y: MetricConfig
  }
) => {
  if(chart) {
    chart.data(data);
    chart.scale(config.x.NAME, config.x.SCALE);
    chart.axis(config.x.NAME, config.x.AXIS.x);
    chart.scale(config.y.NAME, config.y.SCALE);
    chart.axis(config.y.NAME, config.y.AXIS.y);
    chart.interval().position(`${config.x.NAME}*${config.y.NAME}`)
    chart.render()
  }
}