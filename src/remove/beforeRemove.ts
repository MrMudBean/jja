import { isUndefined } from '@vvi/is';
import { _p, fileExist } from '@vvi/node';
import { hexPen, yellowPen } from '@vvi/pen';
import { dog } from '../aided/dog';
import { removeData } from './removeData';
import { removeFileOrDirectory } from './removeFileOrDirectory';
import { wheelRun } from './wheelRun';

/**
 * 移除文件前检测
 * @param element 清理的项
 */
export async function beforeRemove(element: string) {
  if (!removeData.log) {
    _p(hexPen('#336')(`当前清理文件为 ${element}`));
  }
  /**  仅作判断用 */
  const justForJudgment = fileExist(element);
  if (!removeData.log) {
    _p(hexPen('#666')(`正在检测 ${element} 文件/夹是否存在`));
  }
  dog(`文件${element} 数据为 ${justForJudgment}`);

  if (!isUndefined(justForJudgment)) {
    await wheelRun(
      removeFileOrDirectory as (...param: unknown[]) => Promise<boolean>,
      [element, justForJudgment],
    );
  } else if (!removeData.log) {
    _p(yellowPen(`${element} 文件不存在`));
  }
}
