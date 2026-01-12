import dns from 'node:dns';
import { copyTextToClipboard } from '@qqi/copy-text';
import { ArgsArrMapItem } from 'a-command';
import { _p, cursorAfterClear, cursorMoveUp, typewrite } from 'a-node-tools';
import { isEmptyObject, isNull } from 'a-type-of-js';
import { brightMagentaPen, cyanPen, greenPen, redPen } from 'color-pen';
import { waiting } from 'src/aided/waiting';
import { dnsParam } from 'src/types';
import { dog, dun } from '../aided/dog';
import { orangePen, pen666 } from '../aided/pen';
import { dataStore } from './data-store';
import { getIsAliveByAddress } from './get-is-alive-by-address';
import { getIdByDnsServer } from './getIdByDnsServer';

/**
 * ## 与 github 相关的命令
 * @param params 命令参数
 */
export async function dnsCommand(params: ArgsArrMapItem<dnsParam>) {
  dataStore.reset(params.options);
  await getLocalIp();
  await getIp();
  waiting.destroyed();

  const { ips } = dataStore;
  if (Object.keys(ips).length > 0) {
    await printResult();
  } else {
    await printNotFound();
  }
}
/** 打印未找到 ip 地址 */
async function printNotFound() {
  const { domain, port } = dataStore;

  await typewrite(
    `\n找不到 ${redPen(domain)} 的服务器 IP 地址 ${pen666`测试使用 ${port.toString()} 端口`}\n`,
  );
}

/** 通过 dns.lookup 获取本机配置的 ip */
export async function getLocalIp() {
  const { domain, ips } = dataStore;
  waiting.run(`正在获取本地的 ${domain} 的 ip 地址`);
  try {
    const address = await getAddressByLookup(domain);
    // 未获取本地 dns 反解析的 ip
    if (isNull(address)) return;
    // 获取地址的连通性测试结果
    await getIsAliveByAddress(address);
    // 处理结果
    if (!isEmptyObject(ips)) handleResult(domain);
  } catch (err) {
    dog.error(err);
  }
}

/**
 *  处理本地 ip 数联通性
 * @param domain 待检测域名
 */
function handleResult(domain: string) {
  const { ips } = dataStore;
  _p(orangePen`本地配置 ${domain} 的 ip 地址及联通性为：\n`);
  Object.keys(ips).forEach(e => {
    const isAlive = ips[e];
    // 当前的反解析 ip 已经可连通，不走后续的复制环节
    if (isAlive) dataStore.noCopy = false;

    _p(cyanPen`- ${e}`, false);
    _p(isAlive ? orangePen` -> ✅` : pen666` ->  ❌`);
  });
  _p();
}

/**  打印结果 */
export async function printResult() {
  const { domain, ips, port } = dataStore;
  /// 下面是结果总结
  await typewrite(`${brightMagentaPen`${domain}`} 域名解析结果：`);
  _p();
  /**  是否已打印复制  */
  let noCopy = dataStore.noCopy;

  for (const ip in ips) {
    if (Object.prototype.hasOwnProperty.call(ips, ip)) {
      const isAlive = ips[ip];
      const message = isAlive
        ? `${greenPen`- ${ip.padEnd(16)}`} ${orangePen`->`}  ✅${noCopy ? cyanPen`（已复制）` : ''}`
        : `${pen666`- ${ip.padEnd(16)}`} ${redPen`⛓️‍💥`}  ❌`;
      _p(message);
      if (isAlive && noCopy) {
        copyTextToClipboard(`${ip}  ${domain}`);
        noCopy = false;
      }
    }
  }
  _p();
  await typewrite(
    redPen.italic.dim`${domain} 联通性接口判断为 ${port.toString()}`,
  );
  _p();
}

/**  获取 ip */
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

/**
 * ## 通过 dns 的 lookup 按照本地配置的 dns 来获取当前给定域名的反解析 ip
 * @param domain  给定的域名
 */
export async function getAddressByLookup(
  domain: string,
): Promise<null | string[]> {
  return new Promise(resolve => {
    dns.lookup(
      domain,
      {
        all: true,
        family: 4,
      },
      (err, addresses) => {
        if (err) {
          dog.error(`获取本地 ${domain} 的 ip 出错`, err);
          resolve(null);
          return;
        }
        // 测试环境打印消息
        if (!dun)
          waiting.log(
            `获取本地 ${domain} 的 ip 值为 ${addresses.join(' --- ')}`,
          );

        resolve(addresses.map(e => e.address));
      },
    );
  });
}
