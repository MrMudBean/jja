/**
 * @packageDocumentation
 * @module  jja
 * @file change-name.js
 * @description 现在 ixxx 版本已不再随 jja 版本更新
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright  2026 ©️ MrMudBean
 * @since 2026-01-12 09:44
 * @version 2.4.0
 * @lastModified 2026-01-12 09:45
 */

import {
  pathJoin,
  readFileToJsonSync,
  writeJsonFileSync,
  getDirectoryBy,
} from 'a-node-tools';

const packageJson = readFileToJsonSync('./dist/package.json');

/**  原来的名称  */
const on = packageJson.name;
/**  新包的名称  */
const nn = 'ixxx';
packageJson.name = nn;
packageJson.bin = Object.fromEntries([[nn, packageJson.bin[on]]]);

// 写入 dist/package.json
{
  const distPath = getDirectoryBy('dist', 'directory');

  const distPackagePath = pathJoin(distPath, './dist/package.json');

  writeJsonFileSync(distPackagePath, packageJson);
}
