import {
  pathJoin,
  readFileToJsonSync,
  writeJsonFile,
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

  writeJsonFile(distPackagePath, packageJson);
}
