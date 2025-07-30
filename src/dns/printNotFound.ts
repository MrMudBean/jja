import { typewrite } from 'a-node-tools';
import { dataStore } from './data-store';
import { pen666 } from '../aided/pen';
import { redPen } from 'color-pen';

/**
 *
 * 打印未找到 ip 地址
 *
 */
export async function printNotFound() {
  const { domain, port } = dataStore;

  await typewrite(
    `\n找不到 ${redPen(domain)} 的服务器 IP 地址 ${pen666`测试使用 ${port.toString()} 端口`}\n`,
  );
}
