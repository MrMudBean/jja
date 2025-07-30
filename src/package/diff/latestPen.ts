import { boldPen } from 'color-pen';
import { boldGreenPen } from '../../aided/pen';

/**
 * 用来写彩色的  latest
 */
export function latestPen(pkgName: string) {
  return `${boldPen(pkgName)}@${boldGreenPen`latest`}`;
}
