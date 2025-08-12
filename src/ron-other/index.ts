/****************************************************************************
 *  @Author earthnut
 *  @Email earthnut.dev@outlook.com
 *  @ProjectName jja
 *  @FileName runOther.ts
 *  @CreateDate  周四  06/05/2025
 *  @Description 执行代码，使用 Unix 的模式创建环境变量
 *
 ****************************************************************************/
import { isUndefined, isZero } from 'a-type-of-js';
import { command } from '../aided/command';
import { ArgsArrMapItemType } from 'a-command';
import { spawn } from 'node:child_process';
import { dog } from 'src/aided/dog';

/** 导出执行其他代码 */
export async function runOther(runOther: ArgsArrMapItemType<undefined>) {
  const { value } = runOther;

  if (isUndefined(value) || isZero(value.length)) return;

  for (const i in value) {
    /**  当前的命令  */
    const currentItem = value[i].toString();
    // 当前为设置的环境变量
    if (currentItem.includes('=')) {
      const [envKey, ...envValue] = currentItem.split('=');
      if (envKey && envValue) {
        const envValueStr =
          envValue.length > 1 ? `'${envValue.join('=')}'` : envValue[0];
        process.env[envKey] = envValueStr;
        command.SUCCESS(`设置环境变量 ${envKey}=${envValueStr} ✅`);
        value[i] = ''; // 设置为空
      } else {
        command.ERROR(`环境变量格式错误: ${currentItem}`);
        command.error();
      }
    }
    break; // 仅允许前置环境变量的设置
  }

  /**  执行代码  */
  const code = value.join(' ').trim();
  dog('执行代码', code);
  const child = spawn(code, [], {
    stdio: 'inherit', // 继承父进程的输入输出
    env: process.env, // 设置后的环境变量
    shell: true, // 运行独立的 SHELL
  });

  child.on('close', code => code);
  child.on('error', code => code);
  child.on('exit', code => code);
}
