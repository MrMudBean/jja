import { Resolver } from 'node:dns';
import { _p } from 'a-node-tools';
import { isEmptyArray, isNull } from 'a-type-of-js';
import {
  greenPen,
  redPen,
  reversedPen,
  strInOneLineOnTerminal,
} from 'color-pen';
import { orangePen, pen666 } from 'src/aided/pen';
import { waiting } from 'src/aided/waiting';
import { dun } from '../aided/dog';
import { dataStore } from './data-store';
import { getIsAliveByAddress } from './get-is-alive-by-address';

/**
 * 通过配置的 dns 服务器获取给定的 domain 的 ip 值
 *
 * (仅在 get ip 中使用)
 * @param dnsServer dns 服务器 IP
 */
export async function getIdByDnsServer(dnsServer: string = '1.1.1.1') {
  const { domain } = dataStore;
  try {
    /**  反解析的地址  */
    const address = await getAddressByResolve4(domain, dnsServer);

    if (isNull(address)) {
      if (!dun) waiting.log(`${dnsServer} 获取 ${domain} 的 ip 失败`);
      return 0;
    }

    /**  获取地址的连通性测试结果  */
    const results = (await getIsAliveByAddress(address)).filter(
      e => !isNull(e),
    );
    if (isEmptyArray(results)) return 0;
    /// 检测到实际的值
    waiting.destroyed();
    _p();
    _p(reversedPen`DNS: ${dnsServer}`);
    _p();
    results.forEach(({ ip, isAlive }) => {
      const message = isAlive
        ? `${greenPen(ip)} ${orangePen`->`}  ✅`
        : `${pen666(ip)} ${redPen`⛓️‍💥`}  ❌`;
      _p(strInOneLineOnTerminal(message));
    });
    return 3 + results.length;
  } catch (error) {
    if (!dun) waiting.log(`'获取 ip 错误'`, error);
    return 0;
  }
}

/**
 * ##通过 dns 的 resolve4 获取给定 domain 的反解析 ip
 * @param domain 给定的域名
 * @param dnsServer dns 服务器 ip
 */
export async function getAddressByResolve4(
  domain: string,
  dnsServer: string,
): Promise<null | string[]> {
  return new Promise(resolve => {
    const resolver = new Resolver();

    waiting.run(`使用 ${dnsServer} 获取 ${domain} 的 ip`);
    resolver.setServers([dnsServer]);

    resolver.resolve4(domain, (err, addresses) => {
      if (err) {
        if (!dun) waiting.run(`使用 ${dnsServer} 获取 ${domain} 的 ip 出错`);

        return resolve(null);
      }
      if (!dun)
        waiting.log(
          `使用 ${dnsServer} 获取 ${domain} 的 ip 值为 ${addresses.join(' --- ')}`,
        );
      resolve(addresses);
    });
  });
}
