import { isArray, isString } from 'a-type-of-js';
import { hidePen } from 'color-pen';

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
