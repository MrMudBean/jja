/**
 * @packageDocumentation
 * @module  run-other
 * @file index.ts
 * @description 执行其他代码并注入环境变量
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright  2026 ©️ MrMudBean
 * @since 2026-01-12 07:26
 * @version 2.3.21
 * @lastModified 2026-07-08 09:48
 */
import { spawn } from 'node:child_process';
import { ArgsArrMapItem, ERROR, SUCCESS } from '@vvi/command';
import { isUndefined, isZero } from '@vvi/is';
import { dog } from '../aided/dog';

/**
 * 导出执行其他代码
 * @param runOther 命令参数
 */
export async function runOther(runOther: ArgsArrMapItem<undefined>) {
  const { value } = runOther;

  if (isUndefined(value) || isZero(value.length)) return;

  for (const i in value) {
    /**  当前的命令  */
    const currentItem = value[i].toString();
    /**  等号的下标  */
    const equalSignIndex = currentItem.indexOf('=');
    // 当没有查询到等号
    if (equalSignIndex === -1) break;
    // 等号在开头
    if (equalSignIndex === 0) {
      ERROR(`未识别 "${currentItem}" 且已移除该项 ❌`);
      value[i] = ''; // 设置为空
      continue;
    }
    // 构建环境值
    const [_key, _value] = [
      currentItem.slice(0, equalSignIndex),
      currentItem.slice(equalSignIndex + 1) || 'true',
    ];

    process.env[_key] = _value;
    SUCCESS(`设置环境变量 ${_key}=${_value} ✅`);
    value[i] = ''; // 设置为空
  }

  /**  执行代码  */
  const code = value.join(' ').trim();
  dog('执行代码', code);

  /**  启动服务  */
  const child = spawn(code, [], {
    stdio: 'inherit', // 继承父进程的输入输出
    env: process.env, // 设置后的环境变量
    shell: true, // 运行独立的 SHELL
  });

  child.on('close', code => code);
  child.on('error', code => code);
  child.on('exit', code => code);
}
