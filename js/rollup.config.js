import includePaths from 'rollup-plugin-includepaths';

let includePathOptions = {
    include: {},
    paths: [''],
    external: [],
    extensions: ['.js', '.json', '.html']
};

export default {
  entry: 'example/exampleEvents.js', //exampleSingletonAbstract exampleAggregation exampleMapAndSingleton exampleExportImport exampleEvents exampleProxy
  format: 'es6',
  dest: 'bundle.js',
  plugins: [includePaths(includePathOptions)],
};