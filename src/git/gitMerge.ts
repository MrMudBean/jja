import { ERROR, question, selection } from '@vvi/command';
import { isBusinessEmptyString, isUndefined } from '@vvi/is';
import { runOtherCode } from '@vvi/node';

/**
 * 合并两个分支
 * @param params 分支名
 */
export async function gitMerge(params: string) {
  if (isBusinessEmptyString(params)) {
    const branchList = await runOtherCode('git branch -a');
    console.log(branchList.data);
    params =
      (await question({
        text: '请输入要合并分支的名称',
      })) ?? '';
  }

  if (isBusinessEmptyString(params)) {
    return ERROR('没有获取到要合并的分支');
  }

  const result = await selection({
    data: [
      {
        label: '正常快进合并',
        value: '',
      },
      {
        label: '非快进合并 （--no-ff）',
        value: '--no-ff',
      },
      {
        label: '多提交记录合并为一条 （--squash）',
        value: '--squash',
        tip: '适用于将众多小的提交合并成一个提交',
      },
    ],
  });

  if (isUndefined(result)) {
    ERROR('您选择退出合并');
    return;
  }

  await runOtherCode(`git merge ${params} ${result}`);
}
