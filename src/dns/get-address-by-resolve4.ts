import { Resolver } from 'node:dns';
import { dun } from 'src/aided/dog';
import { waiting } from 'src/aided/waiting';

/**  通过 dns 的 resolve4 获取给定 domain 的反解析 ip
 *
 * @param domain 给定的域名
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
