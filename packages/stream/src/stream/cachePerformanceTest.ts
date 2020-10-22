import { Cache } from 'shared/src/cache/cache';
import { Environment } from 'shared/src/enums';
import _ from 'lodash';

export const cacheReadPerfTest = async () => {
    const cacheClient = new Cache(Environment.DEV);
    await cacheClient.getClient();
    const startAt = Date.now();
    const reqsAmount = 3000;
    const reqs = _.times(reqsAmount).map(() => {
      return cacheClient.getValues("test", "groupId = 10");
    })
    await Promise.all(reqs);
    const endAt = Date.now();
    console.log(`done, endTime is ${endAt}, delta is ${endAt - startAt}, avg cost: ${(endAt - startAt)/reqsAmount}ms`)
}
