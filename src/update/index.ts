import { ArgsArrMapItem } from 'a-command';
import { isUndefined } from 'a-type-of-js';
import { updateParams } from 'src/types';
import { command } from '../aided/command';
import { dog } from '../aided/dog';
import { data } from './data';
import { wheel } from './wheel';

/**
 *  导出一个升级包
 * @param param 升级命令
 */
export async function update(param: ArgsArrMapItem<updateParams>) {
  // 用户没有任何输入，则展示默认帮助文档
  if (isUndefined(param.options) || param.options.length == 0) {
    dog.warn('没有匹配到选项，自动抛出帮助文档');
    return command.help('update');
  }

  const options = param.options;

  data.log = !options.some(item => item['--ignore']);

  for (let i = 0, j = options.length; i < j; i++) {
    // 是否在执行的过程中打印信息
    await wheel(options[i]);
  }
}
