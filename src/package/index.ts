import { dog } from '../aided/dog';
import { command } from '../aided/command';
import { packageParam } from '../types';
import { isUndefined } from 'a-type-of-js';
import { wheel } from './wheel';
import { ArgsArrMapItemType } from 'a-command';

/** 包管理的一些东西 */
export async function packageManage(params: ArgsArrMapItemType<packageParam>) {
  if (isUndefined(params.options) || params.options.length == 0) {
    dog.warn('没有参数输入');
    return command.help('package');
  }

  const options = params.options;

  for (let i = 0, j = options.length; i < j; i++) {
    await wheel(options[i]);
  }
}
