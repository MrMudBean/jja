import https from 'node:https';
import { isFalse } from '@vvi/is';
import { npmRegistry } from '@vvi/node';
import { waiting } from '../../aided/waiting';
/**  测试当前的 npm 的 registry 的  */
export async function testNpmRegistry() {
  /**  测试域  */
  const test_list: { [x: string]: string } = {
    淘宝: 'registry.npmmirror.com',
    官方: 'registry.npmjs.org',
    腾讯: 'mirrors.tencent.com/npm',
    中科大: 'npmreg.proxy.ustclug.org',
    yarn: 'registry.yarnpkg.com',
  };
  // const
  const getPromiseList = () =>
    Object.keys(test_list).map(e => call(test_list[e]));
  const response: Record<string, number> = {};
  for (let i = 0; i < 3; i++) {
    waiting.run(
      `请稍等，正在进行第${['一', '二', '三', '四', '五'][i]}次安装源延迟测试`,
    );
    const timeList = await Promise.all(getPromiseList());
    timeList.forEach(e => {
      if (isFalse(e.success)) return;
      /// 如果有该值
      if (response[e.url]) {
        response[e.url] = (response[e.url] + e.time) / 2;
      } else response[e.url] = e.time;
    });
  }
  waiting.destroyed();
  return Object.keys(test_list).reduce(
    (previousValue, currentValue) =>
      response[test_list[currentValue]] <
      (response[test_list[previousValue]] ?? Infinity)
        ? currentValue
        : previousValue,
    '',
  ) as npmRegistry;
}

/**
 *  回调
 * @param e 嗯 😐
 */
function call(e: string): Promise<{
  url: string;
  time: number;
  success: boolean;
}> {
  const start = Date.now();
  return new Promise(resolve => {
    const url = `https://${e}/nry`;
    const req = https.request(url, { method: 'HEAD', timeout: 3500 }, res => {
      if ((res?.statusCode ?? 0) >= 200 && (res?.statusCode ?? 0) < 300) {
        resolve({ url: e, time: Date.now() - start, success: true });
      } else {
        resolve({ url: e, time: Date.now() - start, success: false });
      }
    });
    req.on('error', () =>
      resolve({ url: e, time: Date.now() - start, success: false }),
    );
    req.on('timeout', () => {
      req.destroy();
      resolve({ url: e, time: Date.now() - start, success: false });
    });
    req.end();
  });
}
