import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import copy from 'rollup-plugin-copy';
import { external } from '@qqi/rollup-external';
import license from 'rollup-plugin-license';

export default {
  input: {
    index: './src/bin.ts', // 默认：聚合导出入口
  },
  output: ['es'].map(e => ({
    format: e, // ESM 模式
    entryFileNames: 'bin.js', // 打包文件名
    preserveModules: false, // 保留独立模块结构（关键）
    // preserveModulesRoot: 'src', // 保持 src 目录结构
    sourcemap: false, // 正式环境：关闭 source map
    // exports: 'named', // 导出模式
    dir: `dist/`,
  })),
  // 配置需要排除的包
  external: external({
    include: [
      'src/aided/command',
      'src/aided/waiting',
      'src/aided/dog',
      'src/aided/pen',
      'a-type-of-js/isNumber',
      'a-type-of-js/isFunction',
      'a-type-of-js',
      'a-node-tools',
      'color-pen',
      '@qqi/log',
      'a-command',
      'a-js-tools',
      '@qqi/copy-text',
      'colored-table',
      '@color-pen/static',
    ],
    ignore: [
      'node:dns',
      'node:net',
      'node:https',
      'node:child_process',
      'node:url',
      'node:path',
      'node:fs',
      'node:readline',
      'node:os',
    ],
  }),
  plugins: [
    resolve(),
    commonjs(),
    // 可打包 json 内容
    json(),
    typescript({}),
    // 打包压缩，自动去注释
    terser({
      format: {
        comments: false, // 移除所有注释
      },
    }),
    // 去除无用代码
    cleanup(),
    copy({
      targets: [
        { src: 'README.md', dest: 'dist' },
        { src: 'LICENSE', dest: 'dist' },
      ],
    }),
    license({
      thirdParty: {
        allow: '(MIT OR Apache-2.0 OR BSD-3-Clause)', // 仅允许这些许可证依赖
        output: {
          file: 'dist/THIRD-PARTY-LICENSES.txt',
          template: dependencies =>
            `THIRD-PARTY LICENSE\n${'='.repeat(50)}\n\n`.concat(
              dependencies
                ?.map(
                  dep =>
                    `${dep.name} (${dep.version})\n${'-'.repeat(30)}\n${dep.licenseText}\n`,
                )
                .join('\n'),
            ),
        },
      },
    }),
  ],
};
