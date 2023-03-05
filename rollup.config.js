import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default [
  {
    input: 'lib/index.ts',
    external: ['preact', 'preact/hooks'],
    plugins: [
      typescript({
        typescript: require('typescript'),
      }),
      copy({
        targets: [{ src: 'lib/package.json', dest: 'dist' }],
      }),
      terser(),
    ],
    output: [
      {
        name: 'preactTranslate',
        file: pkg.browser,
        format: 'umd',
        globals: {
          preact: 'preact',
          'preact/hooks': 'preact/hooks',
        },
      },
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
];
