import dns from 'node:dns';
import { dog, dun } from 'src/aided/dog';
import { waiting } from 'src/aided/waiting';

/**  通过 dns 的 lookup 按照本地配置的 dns 来获取当前给定域名的反解析 ip
 *
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
