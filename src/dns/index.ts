import { dataStore } from './data-store';
import { dnsParam } from 'src/types';
import { printResult } from './printResult';
import { getIp } from './getIp';
import { getLocalIp } from './getLocalIp';
import { printNotFound } from './printNotFound';
import { ArgsArrMapItemType } from 'a-command';
import { waiting } from 'src/aided/waiting';

/**
 *
 * 与 github 相关的命令
 *
 */
export async function dns(params: ArgsArrMapItemType<dnsParam>) {
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
