import { dog } from '../aided/dog';
import { Resolver } from 'node:dns';

import { checkIp } from './checkIp';
import { isUndefined } from 'a-type-of-js';
import { dataStore } from './data-store';

/**
 * 通过配置的 dns 服务器获取给定的 domain 的 ip 值
 */
export async function getIdByDnsServer(dnsServer: string = '1.1.1.1') {
  const resolver = new Resolver();
  resolver.setServers([dnsServer]);
  const { domain, ips } = dataStore;
  try {
    const address: undefined | string[] = await new Promise(resolve => {
      resolver.resolve4(domain, (err, addresses) => {
        if (err) {
          dog.error(`使用 ${dnsServer} 获取 ${domain} 的 ip 出错`, err);
          resolve(undefined);
          return;
        }
        dog(
          `使用 ${dnsServer} 获取 ${domain} 的 ip 值为 ${addresses.join(' --- ')}`,
        );
        resolve(addresses);
      });
    });

    if (isUndefined(address)) {
      return { dnsServer, error: '获取 ip 错误' };
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
    return {
      dnsServer,
      results,
    };
  } catch (error) {
    dog.error('获取 ip 错误', error);
    return { dnsServer, error: error };
  }
}
