import { dog } from './dog';
import { command } from './command';
import { remove } from './remove';
import { update } from './update';
import { packageManage } from './package';
import { clearScreen } from './clearScreen';
import { git } from './git';
import { isUndefined } from 'a-type-of-js';
import { dns } from './dns';
import { colorLine } from 'a-node-tools';
import { runCode } from './run';

const arg = command.args.$arrMap;

// 没有匹配到具体的子命令时可返回

if (command.args.$only.length === 0) {
  dog('没有匹配到子命令，打印帮助信息并退出');
  command.help();
  command.end();
}

/** 根据用户的参数 */
async function run() {
  if (arg.length === 0) {
    return;
  }
  // 当前执行的子命令
  const currentSubcommand = arg.shift();

  if (isUndefined(currentSubcommand)) {
    return await run();
  }

  if ('remove' in currentSubcommand) {
    dog('执行文件移除');
    await remove(currentSubcommand.remove!);
  } else if (
    'clearScreen' in currentSubcommand ||
    'clear' in currentSubcommand
  ) {
    dog('执行清屏');
    await clearScreen();
  } else if ('git' in currentSubcommand) {
    dog('执行 git 相关命令');
    await git(currentSubcommand.git!);
  } else if ('package' in currentSubcommand) {
    dog('执行 package 相关命令');
    await packageManage(currentSubcommand.package!);
  } else if ('update' in currentSubcommand) {
    dog('执行 update 相关命令');
    await update(currentSubcommand.update!);
  } else if ('dns' in currentSubcommand) {
    dog('执行 dns 相关的命令');
    await dns(currentSubcommand.dns!);
  } else if ('runOtherCode' in currentSubcommand) {
    dog('执行运行其他命令');
    // await runOther(currentSubcommand.runOtherCode!);
  } else if ('run' in currentSubcommand) {
    dog('执行执行');
    await runCode();
  }

  try {
    await run();
  } catch (error) {
    dog.error('执行 run 报错', error);
  }
}
try {
  await run();
  colorLine(' 终结分割线 ', true);
} catch (error) {
  dog.error('执行 run 报错', error);
}
