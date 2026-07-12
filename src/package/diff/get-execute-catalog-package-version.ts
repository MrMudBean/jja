import { isNull, isUndefined } from '@vvi/is';
import {
  getDirectoryBy,
  getNpmPkgInfo,
  pathJoin,
  readFileToJsonSync,
} from '@vvi/node';
import { dog } from '../../aided/dog';
import { diffData } from './data-store';
import type { LocalInfo } from './types';

/**
 *
 * 获取 pkg 包版本信息
 *
 * 有两个地方使用该数据，然而，在 updateNpm 中的使用已彻底移除
 *
 * 为了兼容 ts ，不更改返回值的类型
 *
 */
export async function getExecuteCatalogPackageVersion(): Promise<void> {
  /// 当前工作目录
  const currentWordDirectory = getDirectoryBy('package.json', 'file');

  if (isUndefined(currentWordDirectory)) {
    dog.warn('未找到当前包的 package.json 文件的位置');
    return;
  }
  // 获取文件
  const packageInfo = readFileToJsonSync<LocalInfo>(
    pathJoin(currentWordDirectory, 'package.json'),
  );

  if (isNull(packageInfo)) {
    dog.error('未找到当前包的 package.json 文件，该事件发生的概率极低');
    return;
  }

  /**  包名  */
  const name = packageInfo.name || '';
  const inlineInfo = await getNpmPkgInfo(name, diffData.registry, 9800);
  diffData.local = packageInfo;
  diffData.online = inlineInfo.data; // 并不关心 null 不 null
}
