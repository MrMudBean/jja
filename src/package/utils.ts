import {
  cursorMoveUp as moveUp,
  _p,
  cursorAfterClear,
  detectPackageManager,
} from 'a-node-tools';
import { isArray, isString } from 'a-type-of-js';
import { hidePen, strInOneLineOnTerminal } from 'color-pen';

/**
 *
 * 将文本打印到同一行
 *
 */
export function printInOneLine(str: string) {
  _p(strInOneLineOnTerminal(str));
}

/** 光标上移并清理该行 */
export function cursorMoveUp(message: string) {
  moveUp();
  cursorAfterClear();
  _p(message);
}

/**
 * 逢 3 加斜杠
 */
export function everyThreePlusBackslash(strList: string[]) {
  if (!isArray(strList) || strList.some(i => !isString(i))) {
    throw new TypeError('参数必须为字符串数组');
  }
  return strList
    .map((str, index) =>
      index % 3 === 2 && index !== strList.length - 1
        ? `${str} ${hidePen`\\`}\n`
        : str.concat(' '),
    )
    .join('');
}
/**  安装方式  */
export const installKind = (() => {
  /**  包管理方式  */
  const packageManager = detectPackageManager();
  /**  不同包管理方式下的包安装办法  */

  return packageManager === 'npm'
    ? 'npm install --save'
    : packageManager === 'yarn'
      ? 'yarn add'
      : 'pnpm add';
})();
