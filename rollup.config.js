import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json';

export default [
  {
    input: 'lib/index.ts',
    external: ['preact', 'preact/hooks'],
    plugins: [
      esbuild({
        include: /\.[jt]sx?$/, // Transpile .js, .ts, .jsx, .tsx files
        exclude: /node_modules/, // Exclude node_modules
        sourceMap: true, // Generate source maps
        minify: process.env.NODE_ENV === 'production', // Minify in production
        target: 'es2015', // Target ES2015
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
