import { dog } from '../../aided/dog';
import { PackageJson, pathJoin, readFileToJsonSync } from 'a-node-tools';
import { isNull } from 'a-type-of-js';
import { diffData } from './data-store';

/**
 *
 * 获取给定包的本地安装版本
 *
 */
export function getInstallVersionByName(pkgName: string) {
  const result = readFileToJsonSync<PackageJson>(
    pathJoin('node_modules/', pkgName, 'package.json'),
  );
  let version = '';
  if (isNull(result)) {
    version = '';
  } else {
    version = result.version || '';
  }

  diffData.dependenceList[pkgName].localVersion = version;
  dog(pkgName, '本地安装的版本为：', version);
  return version;
}
