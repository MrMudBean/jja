import { WARN } from '@vvi/command';
import {
  isArray,
  isEmptyObject,
  isNull,
  isPlainObject,
  isString,
  isType,
  isUndefined,
} from '@vvi/is';
import type { DiffData } from './types';

let isLogLockInfo: boolean = false;

/**
 * # diff 数仓
 */
export const diffData: DiffData = {
  local: null,
  online: null,
  dependenceList: {},
  updateDependence: [],
  latestDependence: [],
  binning: function (list, isDev = false): void {
    /// 空直接返回
    if (isUndefined(list) || isEmptyObject(list) || isNull(this.local)) return;
    const { overrides } = this.local;
    /** 判定并将要跳过的依赖贴出来  */
    let skipList =
      overrides && isPlainObject(overrides) ? Object.keys(overrides) : [];
    if (this.local?.jja?.pkg) {
      const pkg = this.local.jja.pkg;
      /// 当 pkg 是字符串数组时的添加模式
      if (isType<string[]>(pkg, i => isArray(i) && i.every(k => isString(k)))) {
        skipList = skipList.concat(pkg);
      }
      /// 当 pkg 是对象类型添加形式
      if (isType<Record<string, string>>(pkg, i => isPlainObject(i))) {
        skipList = skipList.concat(Object.keys(pkg));
      }
    }
    if (!isLogLockInfo) {
      WARN(`${skipList.join('、')} 已被锁定`);
      isLogLockInfo = true;
    }
    /// 循环遍历
    for (const key in list) {
      if (skipList.includes(key)) {
        continue;
      }
      const element = list[key];
      this.dependenceList[key] = {
        type: isDev ? 'devDependencies' : 'dependencies',
        version: element,
        localVersion: '',
        latestVersion: '',
        onlineVersion: '',
        tag: '',
        time: '',
      };
    }
  },
  preReleaseDependence: [],
  timeoutDependence: [],
  registry: undefined,
};
