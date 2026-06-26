import {
  __p,
  _p,
  cursorAfterClear,
  cursorMoveUp,
  isTTY,
  isWindows,
  runOtherCode,
} from '@vvi/node';
import { dog } from './aided/dog';

/** 导出清理屏幕 */
export async function clearScreen() {
  if (isTTY()) {
    dog('执行第一遍清理');
    await runOtherCode({ code: isWindows ? 'cls' : 'clear', printLog: false });
    dog('执行第二遍清理');
    __p('3J');
    __p('c', false);
    // await runOtherCode({
    //   code: isWindows
    //     ? 'cls'
    //     : `printf '${['2J', '3J', 'H'].map(e => csi.concat(e)).join()}'`,
    //   printLog: false,
    // });
    cursorMoveUp(Infinity);
    cursorAfterClear(true);
  } else {
    dog.warn('当前系统不支持 TTY');
    _p('当前环境不支持 ');
  }
}
