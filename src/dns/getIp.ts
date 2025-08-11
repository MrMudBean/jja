import { cursorAfterClear, cursorMoveUp } from 'a-node-tools';
import { dataStore } from './data-store';
import { getIdByDnsServer } from './getIdByDnsServer';
import { dun } from '../aided/dog';
import { waiting } from 'src/aided/waiting';

/**
 *
 * 获取 ip
 *
 */
export async function getIp() {
  const { domain, dnsServers } = dataStore;
  waiting.log(`${domain} ip 列表：`);

  const promiseList = dnsServers.map(server => getIdByDnsServer(server));

  const results = await Promise.all(promiseList);

  // 正式环境且
  if (dun) {
    cursorMoveUp(
      results.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0,
      ) + 1,
    );
    cursorAfterClear(true);
  }
}
