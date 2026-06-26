import { question } from '@vvi/command';
import { isUndefined } from '@vvi/is';
import { tagCommit } from './tagCommit';

/** 打 tag 之前 */
export async function beforeTagCommit() {
  const tag = await question({
    text: '请输入待标记的信息',
  });

  if (isUndefined(tag)) {
    return;
  }

  await tagCommit(tag);
}
