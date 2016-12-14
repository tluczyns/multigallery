import json from 'rollup-plugin-json';

export default {
  entry: 'main.js',
  format: 'cjs',
  plugins: [ json() ],
  dest: 'bundle.js'
};