import { cursorMoveUp } from '@vvi/node';

/** 导出一个进度条 */
export async function processBar(params: number) {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  params;
  cursorMoveUp(2);
}
