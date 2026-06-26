import { ArgsArrMapOptions } from '@vvi/command';
import type { dnsParam } from '../types';

/**
 *  记录值的类型
 *
 *  - "A"  IPv4 地址 （默认）
 * - 'AAAA'	IPv6 地址
 * - 'ANY'  任何记录
 * - 'CAA'  CA 授权记录
 * - 'CNAME' 规范名称记录
 * - 'MX' 邮件交换记录
 * - 'NAPTR' 名称权限指针记录
 * - 'NS'   名称服务器记录
 * - 'PTR' 指针记录
 * - 'SOA' 授权记录的开始
 * - 'SRV' 服务记录
 * - 'TLSA' 证书关联
 * - 'TXT' 文本记录
 *
 */
export type rrtype =
  | 'A'
  | 'AAAA'
  | 'ANY'
  | 'CAA'
  | 'CNAME'
  | 'MX'
  | 'NAPTR'
  | 'NS'
  | 'PTR'
  | 'SOA'
  | 'SRV'
  | 'TLSA'
  | 'TXT';

export type DataStore = {
  reset(param: ArgsArrMapOptions<dnsParam>[] | undefined): void;
  /**  要检测的域名  */
  domain: string;
  /**  dns 服务器  */
  dnsServers: string[];
  /**  测试的接口  */
  port: number;
  /**  资源记录类型  */
  rrtype: rrtype[];
  /**  本地设置的 ip 可不展示 copy  */
  noCopy: boolean;
  /**  测试后的 ip 列表  */
  ips: {
    [x: string]: boolean;
  };
};

/**  活动的地址信息  */
export type ActiveAddress = {
  ip: string;
  isAlive: boolean;
};
