import { _p } from '@vvi/node';

/**
 * 打印清理结果
 * @param element 将移除的项
 * @param result 移除结果
 */
export function removeResult(element: string, result: boolean | undefined) {
  _p(`清理 ${element} 文件${result ? '完成' : '失败'}`);
}
