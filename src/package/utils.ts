import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import {
  cursorMoveUp as moveUp,
  _p,
  cursorAfterClear,
  detectPackageManager,
  isWindows,
  detectShell,
  getPackageJsonSync,
  fileExist,
  pathJoin,
} from 'a-node-tools';
import { isArray, isString } from 'a-type-of-js';
import { hidePen, strInOneLineOnTerminal } from 'color-pen';

/**  尾缀  */
export const suffix = isWindows ? (detectShell() === 'cmd' ? '^' : '`') : '\\';

/**
 * 将文本打印到同一行
 * @param msg 将打印的文本
 */
export function printInOneLine(msg: string) {
  _p(strInOneLineOnTerminal(msg));
}

/**
 * 光标上移并清理该行
 * @param message 待打印的消息
 */
export function cursorMoveUp(message: string) {
  moveUp();
  cursorAfterClear();
  _p(message);
}

/**
 * 逢 3 加斜杠
 * @param strList 待打印的消息列
 */
export function everyThreePlusBackslash(strList: string[]) {
  if (!isArray(strList) || strList.some(i => !isString(i))) {
    throw new TypeError('参数必须为字符串数组');
  }
  return strList
    .map((str, index) =>
      index % 3 === 2 && index !== strList.length - 1
        ? `${str} ${hidePen(suffix)}\n`
        : str.concat(' '),
    )
    .join('');
}

/**  安装方式  */
export const installKind = (() => {
  const packageManager = detectPackageManager(); // 构建方式
  const ws = isWorkSpace(packageManager);
  //  不同包管理方式下的包安装办法
  return packageManager === 'npm'
    ? 'npm install --save'.concat(ws ? '  --include-workspace-root ' : '')
    : packageManager === 'yarn'
      ? 'yarn add'.concat(ws ? ' -W ' : '')
      : 'pnpm add'.concat(ws ? ' -w ' : '');
})();

/**
 * @todo 该方法可移植到 a-node-tools 中（从 a-node-tools 中获取该方法）
 * @param packageManager 包方式
 */
function isWorkSpace(packageManager: 'npm' | 'pnpm' | 'yarn') {
  const packageJsonResponse = getPackageJsonSync<{
    private: boolean;
    workspaces: string[];
  }>(); // 当前使用的配置文件
  if (packageJsonResponse === null) {
    return false;
  }

  const { content, path } = packageJsonResponse;
  const parentPath = dirname(path);

  if (packageManager === 'pnpm') {
    const workSpaceFilePath = pathJoin(parentPath, 'pnpm-workspace.yaml');
    const workSpaceFileExist = fileExist(workSpaceFilePath);
    if (!workSpaceFileExist) {
      return false; // 当前非工作区
    }
    const workSpaceContent = readFileSync(workSpaceFilePath, {
      encoding: 'utf-8',
    }); // 工作区配置文件
    // 当前有 workspace 的嫌疑
    if (workSpaceContent.split('\n').some(e => e.startsWith('packages:'))) {
      return true;
    }
  }

  // 在以 yarn/npm 为包管理器的环境中，即便是配置文件中的 workspaces 为空数组，也识别为工作区
  if (content.workspaces) {
    if (packageManager === 'yarn') {
      const workSpaceFilePath = pathJoin(parentPath, '.yarnrc.yml');
      const workSpaceFileExist = fileExist(workSpaceFilePath);
      if (workSpaceFileExist) {
        return true;
      }
    }
    if (packageManager === 'npm') {
      return true;
    }
  }

  return false;
}
