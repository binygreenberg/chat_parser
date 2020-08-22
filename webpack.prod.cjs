const merge = require('webpack-merge');
const common = require('./webpack.common.cjs');
// import merge from 'webpack-merge'
// import common from './webpack.common.cjs'
module.exports = merge(common, {
  mode: 'production',
});
