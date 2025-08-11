import { _p, typewrite } from 'a-node-tools';
import { cyanPen, greenPen, pen, redPen } from 'color-pen';
import { dataStore } from './data-store';
import { orangePen, pen666 } from '../aided/pen';
import { copyTextToClipboard } from '@qqi/copy-text';

/**
 *
 * 打印结果
 *
 */
export async function printResult() {
  const { domain, ips, port } = dataStore;
  /// 下面是结果总结
  await typewrite(`${pen.brightMagenta`${domain}`} 域名解析结果：`);
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
