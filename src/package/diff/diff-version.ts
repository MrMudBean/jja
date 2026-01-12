import { prefixList } from 'a-command';
import { _p, PackageJson, pathJoin, readFileToJsonSync } from 'a-node-tools';
import { isNull, isUndefined } from 'a-type-of-js';
import { cyanPen, greenPen } from 'color-pen';
import { waiting } from 'src/aided/waiting';
import { dog } from '../../aided/dog';
import { pen399 } from '../../aided/pen';
import { diffData } from './data-store';
import { getLatestVersionByName } from './get-latest-version-by-name';
import { testNpmRegistry } from './test-npm-registry';

/**
 * 验证依赖的包的线上数据
 */
export async function diffVersion(): Promise<void> {
  const { dependenceList, timeoutDependence } = diffData;
  /**  包名列表  */
  const keys = Object.keys(dependenceList);

  if (
    keys.length > 18 &&
    (isUndefined(diffData.registry) ||
      !['官方', '淘宝', '腾讯', '中科大', 'yarn'].some(
        e => e === diffData.registry,
      ))
  ) {
    diffData.registry = await testNpmRegistry();
    _p(`由于您未设置或者设置有误，现使用 ${cyanPen(diffData.registry)} npm 源`);
  }

  const promiseList = keys.map(
    key =>
      new Promise(resolve => {
        (async () => {
          const pkgInfo = dependenceList[key];
          /**  package.json 中指定的版本  */
          const pkgLocalVersion = dependenceList[key].version;
          waiting.run(`${prefixList.current()}获取 ${key} 的本地安装信息`);
          const pkgLocalInstallVersion = getInstallVersionByName(key);
          waiting.run(
            `${prefixList.success()} ${key} 的本地安装版本：${pkgInfo.localVersion}`,
          );

          /**  本地安装的版本  */
          await getLatestVersionByName(key); // 获取给定包的最新版本号
          if (pkgInfo.onlineVersion === '' && pkgInfo.latestVersion === '') {
            timeoutDependence.push(key); // 将超时的包加入超时包列表
            waiting.log(
              `${prefixList.error()} ${key}  本地 ${pkgInfo.localVersion} 请求错误`,
            );
            return resolve(true);
          }

          // 安装版本即最后发布的 latest 版本
          if (pkgLocalInstallVersion === pkgInfo.onlineVersion) {
            const message = `${key} 的本地${pkgLocalVersion} 安装版本为 ${pkgLocalInstallVersion}  最新是 ${pkgInfo.onlineVersion} `;
            // 没有预发布版本
            if ('' === pkgInfo.latestVersion) {
              waiting.run(prefixList.info() + message);

              return resolve(true);
            }
            diffData.preReleaseDependence.push(key);
            waiting.log(
              `${prefixList.info()} ${message}；最新预发布版本为 ${greenPen(pkgInfo.latestVersion)}`,
            );
            return resolve(true);
          }
          // 该包现安装的本就是最新的预发布版本
          if (pkgLocalInstallVersion === pkgInfo.latestVersion) {
            waiting.log(
              `${prefixList.info()} ${key} 的本地版本${pkgLocalVersion} 安装版本为 ${pkgLocalInstallVersion}`,
            );
            return resolve(true);
          }

          const message = `${key} 的本地 ${greenPen(pkgLocalVersion)} 安装版本为 ${greenPen(pkgLocalInstallVersion)}  最新是 ${pen399(pkgInfo.onlineVersion)} `;
          // 最新版本为 latest
          diffData.latestDependence.push(key);

          // 没有最后发布的版本
          if ('' === pkgInfo.latestVersion) {
            waiting.log(prefixList.info() + message);
            return resolve(true);
          }
          diffData.preReleaseDependence.push(key);
          waiting.log(
            `${prefixList.info()} ${message}；最新预发布版本为 ${greenPen(pkgInfo.latestVersion)}`,
          );
          return resolve(true);
        })();
      }),
  );

  return Promise.all(promiseList).then(() => {
    waiting.destroyed();
  });
}

/**
 * ## 获取给定包的本地安装版本
 * @param pkgName 包名
 */
function getInstallVersionByName(pkgName: string) {
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
