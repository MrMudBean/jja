import {
  getDirectoryBy,
  PackageJson,
  pathJoin,
  readFileToJsonSync,
  runOtherCode,
} from 'a-node-tools';
import { isNull } from 'a-type-of-js';

/**
 * 给提交打上 tag
 * @param commitMessage 提交信息
 */
export async function tagCommit(commitMessage: string) {
  const cwd = getDirectoryBy('package.json', 'file', process.cwd());
  if (cwd == undefined) return true;
  const packageInfo = readFileToJsonSync<PackageJson>(
    pathJoin(cwd, 'package.json'),
  );

  if (isNull(packageInfo) || !packageInfo.version) {
    return true;
  }

  const version = packageInfo.version;

  await runOtherCode({
    code: `git tag -a  v${version} -m '${commitMessage}'`,
    cwd,
  });
  await runOtherCode({ code: 'git push origin --tag', cwd });
}
