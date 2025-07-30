import { command } from '../aided/command';
import { diffPackage } from './diff';
import { updateDependence } from './updateDependence';

/**
 *
 * 循环执行
 *
 */
export async function wheel(params: {
  '--diff'?: (string | number | boolean)[] | undefined;
  '--upDependencies'?: (string | number | boolean)[] | undefined;
}) {
  /** 依赖更新 */
  if (params['--upDependencies']) {
    await updateDependence(true);
  } else if (params['--diff']) {
    /** 检测当前版本 */
    await diffPackage(params['--diff']!);
  } else {
    /** 其余的执行帮助文档 */
    command.help('package');
  }
}
