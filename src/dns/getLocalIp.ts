import { dog } from '../aided/dog';
import dns from 'node:dns';
import { dataStore } from './data-store';
import { isUndefined } from 'a-type-of-js';
import { checkIp } from './checkIp';
import { _p } from 'a-node-tools';
import { orangePen, pen666 } from '../aided/pen';
import { cyanPen } from 'color-pen';

/**
 *
 * 通过 dns.lookup 获取本机配置的 ip
 *
 */
export async function getLocalIp() {
  const { domain, ips } = dataStore;

  try {
    const address: undefined | string[] = await new Promise(resolve => {
      dns.lookup(
        domain,
        {
          all: true,
          family: 4,
        },
        (err, addresses) => {
          if (err) {
            dog.error(`获取本地 ${domain} 的 ip 出错`, err);
            resolve(undefined);
            return;
          }
          dog(`获取本地 ${domain} 的 ip 值为 ${addresses.join(' --- ')}`);
          resolve(addresses.map(e => e.address));
        },
      );
    });
    if (isUndefined(address)) {
      return { error: '获取 ip 错误' };
    }

    const results = await Promise.all(
      address.map(async ip => {
        const isAlive = await checkIp(ip);
        if (!isUndefined(isAlive)) {
          ips[ip] = isAlive;
        }
        return {
          ip: ip.padEnd(16, ' '),
          isAlive: isUndefined(isAlive) ? ips[ip] : isAlive,
        };
      }),
    );
    if (results.length > 0) {
      _p(orangePen`本地配置 ${domain} 的 ip 地址及联通性为：\n`);
      results.forEach(e => {
        _p(cyanPen`- ${e.ip}`, false);
        _p(e.isAlive ? orangePen` -> ✅` : pen666` ->  ❌`);
      });
      _p();
    }

    return {
      results,
    };
  } catch (err) {
    dog.error(err);
    return { error: err };
  }
}
