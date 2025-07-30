import { _p, typewrite } from 'a-node-tools';
import { greenPen, pen, redPen } from 'color-pen';
import { dataStore } from './data-store';
import { orangePen, pen666 } from '../aided/pen';

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
  for (const ip in ips) {
    if (Object.prototype.hasOwnProperty.call(ips, ip)) {
      const isAlive = ips[ip];
      _p(
        isAlive
          ? `${greenPen`- ${ip.padEnd(16)}`} ${orangePen`->`}  ✅`
          : `${pen666`- ${ip.padEnd(16)}`} ${redPen`⛓️‍💥`}  ❌`,
      );
    }
  }
  _p();
  await typewrite(
    redPen.italic.dim`${domain} 联通性接口判断为 ${port.toString()}`,
  );
  _p();
}
