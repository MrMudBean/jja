import { isNull } from '@vvi/is';
import { getNpmPkgInfo } from '@vvi/node';
import { dog } from '../../aided/dog';
import { diffData } from './data-store';

/**
 * 获取给定包的最新版本号（线上数据）
 * @param pkgName 包名
 */
export async function getLatestVersionByName(pkgName: string) {
  /**  获取线上信息  */
  const response = await getNpmPkgInfo(pkgName, diffData.registry, 9867);

  if (response.status === 'timeout') {
    dog.warn('请求超时');
    return;
  }

  // 非空验证
  if (isNull(response.data)) {
    dog.warn('获取包信息失败');
    return;
  }
  const startTime = Date.now();
  dog('获取数据', pkgName, '包信息');

  const pkgInfo = diffData.dependenceList[pkgName];

  const { 'dist-tags': tags, time, version } = response.data;

  /**  最后发布的版本  */
  let lastVersion: string = version,
    lastTag = 'latest';

  pkgInfo.onlineVersion = lastVersion;
  pkgInfo.tag = lastTag;

  const tagKey = Object.keys(tags);

  dog('共需比对', tagKey.length);
  for (let i = 0, j = tagKey.length; i < j; i++) {
    const tag = tagKey[i];
    const version = tags[tag];
    if (time[version] > time[lastVersion]) {
      lastVersion = version;
      lastTag = tag;
    }
  }
  dog('比对', pkgName, '完成');
  dog('耗时', Date.now() - startTime);
  if (lastTag !== 'latest') {
    dog(pkgName, '最新版本为：', lastVersion, 'tag为：', lastTag);
    pkgInfo.tag = lastTag;
    pkgInfo.latestVersion = lastVersion;
  }

  const lt = new Date(time[lastVersion]).toLocaleString();
  // 在获取到最后的最新发布的 tag 后即可通过 time 获取时间
  pkgInfo.time = lt;

  dog(`${pkgName} 的最后发布时间为：${lt}`);
}
