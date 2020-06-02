const merge = require('webpack-merge');
const common = require('./webpack.common.js');

   module.exports = merge(common, {
     watch: true,
     // Default mode for Webpack is production.
     // Depending on mode Webpack will apply different things
     // on final bundle. For now we don't need production's JavaScript
     // minifying and other thing so let's set mode to development
     mode: 'development'
 });
