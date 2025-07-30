import { command } from '../aided/command';
import { _p, getDirectoryBy, runOtherCode } from 'a-node-tools';
import { hexPen } from 'color-pen';
import { tagCommit } from './tagCommit';

/** 整理 git
 *
 * @param [commitMessage="版本维护"]  提交信息
 * @param [tag=false]  是否给提交打上 tag
 */
export async function gitCommit(
  commitMessage: string = '版本维护',
  tag: boolean = false,
) {
  /// 检测当前目录下有没有  .git  文件夹
  const cwd = getDirectoryBy('.git', 'directory');
  if (cwd == undefined) {
    return _p(hexPen('#ff0')('not a git repository（当前目录非 git 储存库）'));
  }
  const addResult = await runOtherCode({ code: 'git add .', cwd });
  // 倘若没有成功，可能是执行目录下没有  .git
  if (!addResult.success) {
    return console.log(addResult.error) != undefined;
  }
  const gitStatus = await runOtherCode({ code: 'git status', cwd });
  if (!/nothing to commit, working tree clean/.test(gitStatus.data || '')) {
    const addResult = await runOtherCode({ code: `git add .`, cwd });
    if (!addResult.success) return console.log(addResult.error) != undefined;
    if (commitMessage.trim() == '') {
      commitMessage =
        (await command.question({
          text: '请输入提交信息',
        })) ?? '';
    }
    const commitResult = await runOtherCode({
      code: `git commit -m "${commitMessage}"`,
      cwd,
    });
    if (!commitResult.success)
      return console.log(commitResult.error) != undefined;
    // 打印是 stderr
    if (commitResult.error) console.log(commitResult.error);
    await runOtherCode({ code: 'git push', cwd });
    // 需要打标签
    if (tag) await tagCommit(commitMessage);
    return true;
  }
  return false;
}
