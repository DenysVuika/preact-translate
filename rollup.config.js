import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-copy';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'lib/main.js',
    output: {
      name: 'preactTranslate',
      file: pkg.browser,
      format: 'umd',
      globals: {
        preact: 'preact',
        'preact/hooks': 'preact/hooks'
      }
    },
    external: ['preact', 'preact/hooks'],
    plugins: [
      resolve(), // so Rollup can find libs
      babel({
        babelrc: false,
        sourceMap: true,
        plugins: [
          'transform-class-properties',
          ['@babel/plugin-transform-react-jsx', { pragma: 'h' }]
        ],
        exclude: 'node_modules/**' // only transpile our source code
      }),
      commonjs(), // so Rollup can convert libs to an ES module,
      copy({
        targets: [{ src: 'lib/package.json', dest: 'dist' }]
      })
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'lib/main.js',
    external: ['preact', 'preact/hooks'],
    plugins: [
      babel({
        babelrc: false,
        sourceMap: true,
        plugins: [
          'transform-class-properties',
          ['@babel/plugin-transform-react-jsx', { pragma: 'h' }]
        ],
        exclude: 'node_modules/**' // only transpile our source code
      })
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
];
