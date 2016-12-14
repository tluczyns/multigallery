import includePaths from 'rollup-plugin-includepaths'; //pozwala na używanie bezwzglednych ścieżek w importach
import nodeResolve from 'rollup-plugin-node-resolve'; //służy do importu modułów node
import commonjs from 'rollup-plugin-commonjs'; //służy do importu plików js zgodnych z common.js

export default {
    entry: 'application.js', // application.js example/ exampleRunRollup exampleJQuery exampleJQueryAddress exampleTweenMax base/vspm/StateModel.js
    dest: 'bundle.js',
    format:'es6',
    plugins: [
		includePaths({
			include: {},
			paths: [''],
			external: [],
			extensions: ['.js', '.json', '.html']
		}),
		nodeResolve({
			jsnext: true,  // false exampleRunRollup
			main: true,
		}),
        commonjs({
			namedExports: {
			//	'd:\praca\!Tomek2\MultiGalleryJS\js\node_modules\gsap\src\uncompressed\TweenMax.js': ['TweenMax'],
			//	'node_modules/angular/angular.min.js' : ['angular'],
			//	'node_modules/bootstrap/dist/js/bootstrap.min.js' : ['bootstrap']
            }
        })
    ],
    globals: {
    },
    external: [
    ]
}