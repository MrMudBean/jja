import { colorLine } from 'a-node-tools';
import { isEmptyArray, isUndefined } from 'a-type-of-js';
import { randomPen } from 'color-pen';
import { command } from './aided/command';
import { dog } from './aided/dog';
import { clearScreen } from './clearScreen';
import { dnsCommand } from './dns';
import { git } from './git';
import { packageManage } from './package';
import { remove } from './remove';
import { runOther } from './ron-other';
import { update } from './update';

const arg = command.args.$arrMap;

dog(arg);

dog(command.args.$original);

// 没有匹配到具体的子命令时可返回

if (command.args.$isVoid) {
  dog('没有匹配到子命令，打印帮助信息并退出');
  command.help();
  command.end();
} else if (isEmptyArray(command.args.$only)) {
  console.log(
    `${command.args.$nomatch.map(e => randomPen(e)).join('、')} 不是有效的参数`,
  );
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

  if (currentSubcommand.remove) {
    dog('执行文件移除');
    await remove(currentSubcommand.remove!);
  } else if (currentSubcommand.clearScreen || currentSubcommand.clearTerminal) {
    dog('执行清屏');
    await clearScreen();
  } else if (currentSubcommand.git) {
    dog('执行 git 相关命令');
    await git(currentSubcommand.git);
  } else if (currentSubcommand.package) {
    dog('执行 package 相关命令');
    await packageManage(currentSubcommand.package!);
  } else if (currentSubcommand.update) {
    dog('执行 update 相关命令');
    await update(currentSubcommand.update!);
  } else if (currentSubcommand.dns) {
    dog('执行 dns 相关的命令');
    await dnsCommand(currentSubcommand.dns!);
  } else if (currentSubcommand.runOtherCode) {
    dog('执行运行其他命令');
    await runOther(currentSubcommand.runOtherCode!);
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
