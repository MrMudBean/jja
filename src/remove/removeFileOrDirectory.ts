import { Stats } from 'node:fs';
import { _p, isWindows, runOtherCode } from 'a-node-tools';
import { hexPen } from 'color-pen';
import { removeData } from './removeData';
import { removeResult } from './removeResult';

/**
 * 移除文件或是目录
 * @param element 移除的项
 * @param justForJudgment 仅做判定
 */
export async function removeFileOrDirectory(
  element: string,
  justForJudgment: Stats,
): Promise<boolean> {
  if (!removeData.log) {
    _p(hexPen('#aaa')(` ${element} 文件/夹存在，准备删除`));
  }
  let result: {
    error: unknown;
    success?: boolean | undefined;
    data?: unknown;
  } = { error: null };

  if (isWindows) {
    if (justForJudgment.isDirectory()) {
      result = await runOtherCode(`rd /q /s  ${element.replace(/\//, '\\')}`);
      removeResult(element, result.success);
      // rmdirSync(element, { force: true, recursive: true });
    } else if (justForJudgment.isFile()) {
      // rmSync(element, { force: true });
      result = await runOtherCode(
        `del  ${
          removeData.subdirectories ? '/s' : ''
        }  /q  ${element.replace(/\//, '\\')}`,
      );
      removeResult(element, result.success);
    }
  } else {
    result = await runOtherCode(`rm -rf  ${element.replace(/\\/, '/')}`);
    removeResult(element, result.success);
  }
  if (!result.success) {
    console.log(result.error);
    return false;
  }
  return true;
}
