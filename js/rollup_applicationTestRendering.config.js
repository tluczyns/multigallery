import includePaths from 'rollup-plugin-includepaths';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'applicationTestRendering.js',
    dest: 'bundleApplicationTestRendering.js',
    format:'es6',
    plugins: [
		includePaths({
			include: {},
			paths: [''],
			external: [],
			extensions: ['.js', '.json', '.html']
		}),
		nodeResolve({
			jsnext: true,
			main: true,
		}),
        commonjs()
    ],
    globals: {
    },
    external: [
    ]
}