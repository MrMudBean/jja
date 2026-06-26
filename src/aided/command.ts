import { Args } from '@vvi/command';
import { hexPen, randomPen, redPen } from '@vvi/pen';
import { ArgsArrMapItemList } from '../types';
import { dog } from './dog';

// 初始化一个命令
export const command = new Args<ArgsArrMapItemList>('jja');

command
  .bind({
    'package <pkg>  (包管理)': [
      '--diff <-d>  (分析当下包的差异)',
      `--upDependencies <-u> (更新依赖，强制更新到 'latest',使用需谨慎)`,
    ],
    'remove <rm> (做一个简单的兼容的移除文件或文件夹的命令)': [
      '--ignore <-i> (不打印日志（默认打印的）)',
      '--subdirectories <-s> (这是一个危险的命令，用于 windows 下递归删除执行命令下所有的给定文件名称)',
    ],
    'update <up> (做一个简单的 npm 升级程序，对，简单的)': [
      '--ignore <-i> (不建议你这么用，你会发现你像个傻子一样在那等结果)',
      `--dependencies <-d> (更新依赖，跟 ${randomPen('npm update')} 一样)`,
    ],
    'clearScreen <cls> (清理终端显示屏幕，同 clearTerminal )': '',
    'clearTerminal  <clear>  (清理终端显示屏幕，同 clearScreen )': '',
    'git   (一些关于 git 的操作)': [
      `commit (git 提交代码，是 ${redPen(
        'commit',
      )} 提交啊，不是 ${hexPen('#666')('push')} 推送)`,
      'merge (合并两个分支)',
      'tag (给提交打上 tag)',
    ],
    'dns  (使用 dns 获取 ip 地址)': [
      '--domain <-d> (获取给定域名获取 ip 地址，默认 github.com )',
      '--port <-p> (配置要校验的 port 端口号，默认为 443)',
      // 未来版本功能预留
      // '--rrtype <-r> (配置要校验的 rrtype 类型，默认（传入非法值时）为 A)',
    ],
    // 'run 执行': [],
    // 执行不可预估
    'runOtherCode <run> (执行其他的代码,使用 )': [],
  })
  .run();

dog('参数已绑定，且已解析用户参数', command.args);
dog.warn('当前的执行状态', command.state);

command.isEnd(true);
