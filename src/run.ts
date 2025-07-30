import { SelectionParamObjectData } from 'a-command';
import {
  _p,
  getDirectoryBy,
  PackageJson,
  pathJoin,
  readFileToJsonSync,
  runOtherCode,
} from 'a-node-tools';
import { isEmptyObject, isUndefined } from 'a-type-of-js';
import { cyanPen, magentaPen } from 'color-pen';
import { command } from './aided/command';
import { dog } from './aided/dog';

/**  执行 npm 命令  */
export async function runCode() {
  // 判断当前目录下是否存在 package.json 文件
  const cwd = getDirectoryBy('package.json', 'file');
  if (cwd == undefined)
    return _p(magentaPen`当前目录下不存在 package.json 文件`);
  // 抓取依赖数据
  const scripts =
    readFileToJsonSync<PackageJson>(pathJoin(cwd, 'package.json'))?.scripts ||
    {};

  if (isEmptyObject(scripts)) {
    return _p(cyanPen`没有可执行的命令`);
  }
  _p(scripts);

  const dataList: SelectionParamObjectData<string>[] = (() => {
    const keys = Object.keys(scripts);

    return keys
      .filter(e => {
        if (!e.startsWith('pre') && !e.startsWith('post')) {
          return true;
        }
        /**  真实命令  */
        const realCommand = e.replace(/^(pre|post)/, '');

        if (keys.includes(realCommand)) return false;

        if (
          [
            'build',
            'install',
            'publish',
            'pack',
            'version',
            'test',
            'start',
            'restart',
            'stop',
            'publishOnly',
            'deploy',
            'pare',
          ].includes(realCommand)
        )
          return false;
        return true;
      })
      .map(e => ({
        value: scripts[e],
        label: e,
        tip: scripts[e],
      }));
  })();

  const result = await command.selection(dataList);

  dog(result);
  if (isUndefined(result)) return;

  await runOtherCode({
    code: result,
    // printLog: true,
    // origin: true,
  });
}
