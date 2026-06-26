import { ArgsArrMapOptions } from '@vvi/command';
import { isUndefined } from '@vvi/is';
import { intersection } from '@vvi/utils';
import type { dnsParam } from '../types';
import { DataStore, rrtype } from './types';

/** 可用的记录值类型 */
export const rrtypeList: rrtype[] = [
  'A',
  'AAAA',
  'ANY',
  'CAA',
  'CNAME',
  'MX',
  'NAPTR',
  'NS',
  'PTR',
  'SOA',
  'SRV',
  'TLSA',
  'TXT',
];

export const dataStore: DataStore = {
  domain: 'github.com',
  port: 443,
  dnsServers: [
    '1.1.1.1',
    '8.8.8.8',
    '8.8.4.4',
    //  Quad9 DNS 不稳定，暂时不使用
    // '9.9.9.9',
    '208.67.222.222',
    '114.114.115.115',
    '223.5.5.5',
    '180.76.76.76',
  ],
  ips: {},
  rrtype: ['A'],
  reset(param: ArgsArrMapOptions<dnsParam>[] | undefined): void {
    this.ips = {};
    this.domain = 'github.com';
    this.port = 443;
    this.rrtype = [];
    if (isUndefined(param)) {
      return;
    }

    param.forEach(item => {
      const domain = item['--domain'];

      if (!isUndefined(domain) && domain.length > 0) {
        this.domain = domain[0].toString();
      }

      const port = item['--port'];
      if (!isUndefined(port) && port.length > 0) {
        this.port = Number(port[0]);
      }

      const rrtype = item['--rrtype'];
      if (!isUndefined(rrtype) && rrtype.length > 0) {
        const inputRrtypeList = intersection<rrtype>(
          rrtypeList,
          rrtype as rrtype[],
        );
        /// 两者有共同的交集
        if (inputRrtypeList.length > 0) this.rrtype = inputRrtypeList;
      }
    });
  },
  noCopy: true,
};
