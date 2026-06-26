import { isFalse } from '@vvi/is';
import { Dog } from '@vvi/log';

/**  dev log  */
export const dog = new Dog({
  name: 'jja',
  type: false,
});
/**  正式环境  */
export const dun = isFalse(dog.type);
