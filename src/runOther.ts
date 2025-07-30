/****************************************************************************
 *  @Author earthnut
 *  @Email earthnut.dev@outlook.com
 *  @ProjectName jja
 *  @FileName runOther.ts
 *  @CreateDate  周四  06/05/2025
 *  @Description 思虑再三，还是砍掉了这个鸡肋的功能
 *
 * <span style="color:#f36;">弃用功能业</span>
 ****************************************************************************/

import {
  PackageJson,
  readFileToJsonSync,
  runOtherCode,
  RunOtherCodeResult,
} from 'a-node-tools';
import { isUndefined, isZero } from 'a-type-of-js';
import { command } from './aided/command';
import { ArgsArrMapItemType } from 'a-command';

/** 导出执行其他代码 */
export async function runOther(runOther: ArgsArrMapItemType<undefined>) {
  const { value } = runOther;

  if (isUndefined(value) || isZero(value.length)) {
    return;
  }

  const packageInfo = readFileToJsonSync<PackageJson>('package.json') ?? {
    scripts: {},
  };

  const scripts: { [x: string]: string } = packageInfo?.scripts ?? {};

  const firstCommand = value[0].toString();

  let code = `npm run ${value.join(' ')}`;

  let result: RunOtherCodeResult;

  // 当前命令的第一个命令存在于 package
  if (scripts[firstCommand]) {
    result = await runOtherCode({
      code,
      printLog: true,
      waiting: true,
    });
    if (result.success) {
      command.SUCCESS(`执行 ${code} ✅`);
      return;
    } else {
      command.ERROR(`执行 ${code} ☹️`);
      command.error();
    }
  }

  code = `npx ${value.join(' ')}`;

  result = await runOtherCode({ code, waiting: true });

  if (result.success) {
    command.SUCCESS(`执行 ${code} ✅`);
    return;
  }

  code = value.join(' ');
  result = await runOtherCode({ code, printLog: true });

  if (result.success) {
    command.SUCCESS(`执行 ${code} ✅`);
  } else {
    command.ERROR(`执行 ${code} ☹️`);
    command.error();
  }
}
