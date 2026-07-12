/**
 * @module @jja/types
 * @file types.ts
 * @description _
 * @author Mr.MudBean <Mr.MudBean@outlook.com>
 * @copyright 2026 ©️ Mr.MudBean
 * @since 2026-07-12 16:16
 * @version 2.5.3
 * @lastModified 2026-07-12 17:05
 */

import type { npmPkgInfoType, npmRegistry, PackageJson } from '@vvi/node';

export type LocalInfo = PackageJson<{
  overrides?: {
    [x: string]: string;
  };
  jja?: {
    pkg?: string[] | Record<string, string>;
  };
}>;

export type DiffData = {
  /**  本地 package.json 数据  */
  local: LocalInfo | null;
  /**  pkg npm 线上数据  */
  online: npmPkgInfoType | null;
  /**  依赖信息  */
  dependenceList: {
    [x: string]: {
      type: 'dependencies' | 'devDependencies';
      /**  package.json 中指定的版本  */
      version: string;
      /**
       * 最后发布的版本，非最后的 latest 版本
       *
       * 且仅在最后发布的版本不是 latest 版本时才有值
       */
      latestVersion: string;
      /**  本地安装版本  */
      localVersion: string;
      /**  线上最后一个 latest 版本  */
      onlineVersion: string;
      /**  最后发布的时间  */
      time: string;
      // 安装的标签
      tag: string;
    };
  };
  /**  可更新依赖  */
  updateDependence: string[];
  /**  最后版本不在安全更新范围的依赖  */
  latestDependence: string[];
  /**  有最新的预发布版本  */
  preReleaseDependence: string[];
  /**  请求超时的版本  */
  timeoutDependence: string[];
  /**  数据装箱  */
  binning: (list: { [x: string]: string } | undefined, isDev?: boolean) => void;
  /**  npmRegistry  */
  registry: npmRegistry | undefined;
};
