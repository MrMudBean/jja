import { dog } from '../aided/dog';
import { pen } from 'color-pen';
import { _p, isWindows } from 'a-node-tools';
import { removeParam } from '../types';
import { removeData } from './removeData';
import { beforeRemove } from './beforeRemove';
import { ArgsArrMapItemType } from 'a-command';

/** 移除文件或是目录 */
export async function remove(params: ArgsArrMapItemType<removeParam>) {
  /** 删除参数 */
  const delArr = params.value || [];

  /** 具体要移除的文件 */
  const options = params.options;

  options?.forEach(item => {
    const noLogInfo = item['--ignore'];
    if (noLogInfo) {
      removeData.log = true;
      delArr.concat(noLogInfo);
    }
    const subdirectories = item['--subdirectories'];
    if (subdirectories) {
      removeData.subdirectories = true;
      delArr.concat(subdirectories);
    }
  });

  if (!removeData.log) {
    _p(pen.brightCyan`当前系统为: ${isWindows ? 'windows' : 'linux/mac'}`);
  }
  if (delArr.length == 0) {
    dog.warn('待删除列表', delArr);
    _p(pen.random`没有待清理的文件/文件夹`);
  }
  /// 反着清理（这里并没有使用 wheel 执行，而是简单的 while 循环）
  while (delArr.length) {
    let currentEle = delArr.pop();

    currentEle = currentEle === undefined ? 'undefined' : currentEle.toString();

    await beforeRemove(currentEle);
  }
}
