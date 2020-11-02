import { cacheReadPerfTest } from './cachePerformanceTest';
import { StreamServer } from './streamServer';

export const start = () => {
  const server = new StreamServer();
};

start();
// cacheReadPerfTest();