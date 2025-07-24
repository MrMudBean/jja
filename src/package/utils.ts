import {
  cursorMoveUp as moveUp,
  _p,
  cursorAfterClear,
  getDirectoryBy,
} from 'a-node-tools';
import { isArray, isString } from 'a-type-of-js';
import { hidePen } from 'color-pen';

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

/**  检测当前的启动执行  */
export function detectPackageManager(): 'npm' | 'pnpm' | 'yarn' {
  const _ = (test: string) => Boolean(getDirectoryBy(test, 'file'));

  /**  判断是否存在 pnpm 的锁文件  */
  if (_('pnpm-lock.yaml')) return 'pnpm';
  /**  判断是否有 yarn 的锁文件  */ else if (_('yarn.lock')) return 'yarn';
  /**  判断是否有 npm 的锁文件  */ else if (_('package-lock.json'))
    return 'npm';

  const userAgent = process.env.npm_config_user_agent || '';
  if (userAgent.includes('pnpm')) return 'pnpm';
  if (userAgent.includes('yarn')) return 'yarn';
  if (userAgent.includes('npm')) return 'npm';

  // 2. 检测环境变量
  if (process.env.PNPM_HOME) return 'pnpm';
  if (process.env.YARN_IGNORE_PATH) return 'yarn';

  return 'npm';
}
