import {
  _p,
  getDirectoryBy,
  PackageJson,
  pathJoin,
  readFileToJsonSync,
  runOtherCode,
} from 'a-node-tools';

import { cyanPen, greenPen } from 'color-pen';
import { cursorMoveUp } from './utils';

/**
 *
 *  升级依赖
 *
 * @param [log=true]  是否打印更新依赖的原始打印消息
 */
export async function updateDependence(log: boolean = true) {
  // 判断当前目录下是否存在 package.json 文件
  const cwd = getDirectoryBy('package.json', 'file');
  if (cwd == undefined) return _p('当前目录下不存在 package.json 文件');
  // 抓取依赖数据
  const dependencies =
    readFileToJsonSync<PackageJson>(pathJoin(cwd, 'package.json'))
      ?.dependencies || {};
  if (log) {
    _p(greenPen('初始化完成，等待下一步命令'));
  }
  if (Object.keys(dependencies).length > 0) {
    let upNpmString = `npm install --save`;
    // 遍历查找依赖更新
    for (let i = Object.keys(dependencies), j = i.length, k = 0; k < j; k++) {
      const currentEle = i[k];
      // npm 会自动把其安装在父级类文件夹下
      upNpmString += `  ${currentEle}@latest  `;
    }
    await runOtherCode(upNpmString);
  }
  if (log) {
    _p(cyanPen(`正在更新 dev 依赖`));
  }
  // npm 会自动把其安装在父级类文件夹下
  await runOtherCode(`npm update --save`);
  if (log) {
    cursorMoveUp(`开发依赖更新完毕`);
  }
}
