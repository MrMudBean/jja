import { ArgsArrMapItem } from '@vvi/command';
import { isPlainObject, isUndefined } from '@vvi/is';
import { command } from '../aided/command.js';
import { dog } from '../aided/dog';
import type { gitParam } from '../types';
import { wheel } from './wheel.js';

/**
 *
 * 与 git 相关的
 *
 * @param params
 */
export async function git(params: ArgsArrMapItem<gitParam>) {
  if (isPlainObject(params)) params = { value: [] };

  if (isUndefined(params.options) || params.options.length === 0) {
    dog.warn('没有配置项，直接返回的帮助文档');
    return command.help('git');
  }

  const options = params.options;

  for (let i = 0, j = options.length; i < j; i++) {
    dog('本次执行', options[i]);
    await wheel(options[i]);
  }
}
