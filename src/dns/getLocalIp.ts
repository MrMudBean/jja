import { dog } from '../aided/dog';
import { dataStore } from './data-store';
import { isEmptyObject, isNull } from 'a-type-of-js';
import { _p } from 'a-node-tools';
import { orangePen, pen666 } from '../aided/pen';
import { cyanPen } from 'color-pen';
import { getAddressByLookup } from './get-address-by-lookup';
import { getIsAliveByAddress } from './get-is-alive-by-address';
import { waiting } from 'src/aided/waiting';

/**
 *
 * 通过 dns.lookup 获取本机配置的 ip
 *
 */
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

/**  处理本地 ip 数联通性  */
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
