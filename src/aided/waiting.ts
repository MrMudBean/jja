import { waitingTips } from '@vvi/node';
import { command } from './command';

/**  等待  */
export const waiting = waitingTips({
  show: false,
  info: '请稍等',
  beforeDestroyed: exitProactively => exitProactively && command.end(),
});
