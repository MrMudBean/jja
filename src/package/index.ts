import { ArgsArrMapItem } from '@vvi/command';
import { isUndefined } from '@vvi/is';
import { command } from '../aided/command';
import { dog } from '../aided/dog';
import { packageParam } from '../types';
import { wheel } from './wheel';

/**
 * 包管理的一些东西
 * @param params 包使用参数
 */
export async function packageManage(params: ArgsArrMapItem<packageParam>) {
  if (isUndefined(params.options) || params.options.length == 0) {
    dog.warn('没有参数输入');
    return command.help('package');
  }

  const options = params.options;

  for (let i = 0, j = options.length; i < j; i++) {
    await wheel(options[i]);
  }
}
