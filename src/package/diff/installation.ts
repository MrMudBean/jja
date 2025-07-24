import { _p } from 'a-node-tools';
import { hidePen, pen } from 'color-pen';
import { copyTextToClipboard } from '@qqi/copy-text';
import { pen666 } from '../../pen';
import { terminalRegExp } from '@color-pen/static';
import { detectPackageManager, everyThreePlusBackslash } from '../utils';

/**
 *
 * 安装方式
 *
 */
export async function installation(options: {
  msg: string;
  list: string[];
  type: 'brightGreen' | 'brightMagenta' | 'brightRed';
  copy?: boolean;
}) {
  const { msg, list, type, copy } = options;
  const colorPen = pen[type];
  /**  包管理方式  */
  const packageManager = detectPackageManager();
  /**  不同包管理方式下的包安装办法  */
  const installKind =
    packageManager === 'npm'
      ? 'npm install --save'
      : packageManager === 'yarn'
        ? 'yarn add'
        : 'pnpm add';
  _p();
  _p(colorPen.reversed(msg), false);
  _p(copy ? pen666.reversed`已复制到剪切板 📋` : '');
  _p();
  _p(
    `${colorPen(installKind)} ${hidePen`\\`}\n${everyThreePlusBackslash(list)}`,
  );
  _p();
  if (copy) {
    await copyTextToClipboard(
      `npm install --save ${list.join(' ')}`.replace(terminalRegExp(), ''),
    );
  }
}
