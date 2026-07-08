import { pathJoin, writeJsonFileSync, getPackageJsonSync } from '@vvi/node';
import { dirname } from 'node:path';

const packageJsonResponse = getPackageJsonSync();

if (!packageJsonResponse) {
  throw new RangeError('未能识别配置文件 package.json');
}

let packageJson = packageJsonResponse.content;

[
  'scripts',
  'devDependencies',
  'lint-staged',
  'private',
  'dependencies',
].forEach(key => delete packageJson[key]);

packageJson = {
  ...packageJson,
  author: {
    name: '泥豆君',
    email: 'Mr.MudBean@outlook.com',
    url: 'https://mudbean.cn',
  },
  description: '一些在终端的执行动作 🥜',
  license: 'MIT',
  files: ['bin.js', 'LICENSE', 'README.md', 'THIRD-PARTY-LICENSES.txt'],
  keywords: [
    'jja',
    'remove file',
    'Remove file across platforms',
    'Environmental parameters start',
    'Check dependency for the latest version',
    'Check domain resolution and connectivity',
    '跨端移除文件',
    '参数启动',
    '检测依赖最新版本',
    '检测域名解析及联通性',
  ],
  homepage: 'https://npm.lmssee.com/jja',
  bugs: {
    url: 'https://github.com/MrMudBean/jja/issues',
    email: 'Mr.MudBean@outlook.com',
  },
  repository: {
    type: 'git',
    url: 'git+https://github.com/MrMudBean/jja.git',
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  },
  bin: {
    jja: 'bin.js',
  },
  engines: {
    // 新增：声明 Node.js 兼容版本
    node: '>=18.0.0',
  },
};

// 写入 dist/package.json
{
  writeJsonFileSync(
    pathJoin(dirname(packageJsonResponse.path), './dist/package.json'),
    packageJson,
  );
}
