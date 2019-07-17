import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import copy from 'rollup-plugin-copy'

import pkg from './package.json';

export default [
	// browser-friendly UMD build
	{
		input: 'lib/src/main.js',
		output: {
			name: 'preactTranslate',
			file: pkg.browser,
			format: 'umd'
		},
		external: ['preact'],
		plugins: [
			resolve(), // so Rollup can find libs
			buble({
				jsx: 'h'
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
		input: 'lib/src/main.js',
		external: ['preact'],
		plugins: [
			buble({
				jsx: 'h'
			}),
		],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
];
