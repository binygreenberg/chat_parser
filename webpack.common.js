// Webpack uses this to work with directories
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// This is the main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  // Path to your entry point. From this file Webpack will begin his work
  entry: {
    'bundle': './src/javascript/index.js', //specifying bundle with custom js files
    'styles-custom': './src/styles-custom.js', //specifying bundle with custom css files
  },
  // Path and filename of your result bundle.
  // Webpack will bundle all JavaScript into these file
  output: {
    path: path.resolve(__dirname, 'dist'),
    // filename: 'bundle.js'
    filename: '[name].js' //using [name] will create a bundle with same file name as source
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};
