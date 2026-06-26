import net from 'node:net';
import { isBoolean } from '@vvi/is';
import { dun } from '../aided/dog';
import { waiting } from '../aided/waiting';
import { dataStore } from './data-store';
import { ActiveAddress } from './types';

/**
 * # 通过地址数获取测试 ip 的连通性
 * @param address 通信 ip
 */
export async function getIsAliveByAddress(
  address: string[],
): Promise<(ActiveAddress | null)[]> {
  return Promise.all(address.map(ip => checkIp(ip)));
}

/**
 * # 校验 ip 的联通性
 *
 * @param ip
 * @param timeout
 */
export async function checkIp(
  ip: string,
  timeout: number = 3000,
): Promise<null> {
  const { ips, port } = dataStore;

  if (isBoolean(ips[ip])) {
    if (!dun) waiting.log(`${ip} 联通性已校验过 ${ips[ip] ? '🔥' : '⛓️‍💥'}`);
    return Promise.resolve(null);
  }
  // 初始化不可用状态，禁止同名 ip 重复查询
  ips[ip] = false;

  if (!dun) waiting.log(`校验 ${ip} 的联通性`);

  return new Promise(resolve => {
    const socket = new net.Socket();
    /**
     *  反回结果
     * @param isAlive 是否是存活的地址
     */
    const _ = (isAlive: boolean = false) => {
      ips[ip] = isAlive; // 更新状态
      socket.destroy();
      resolve(null);
    };
    socket.setTimeout(timeout);
    socket.on('connect', () => _(true));
    socket.on('timeout', () => _());
    socket.on('error', () => _());
    if (!dun) waiting.log('测试的接口为：', port);
    socket.connect(port, ip);
  });
}
