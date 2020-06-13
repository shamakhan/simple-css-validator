var path = require('path');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var libraryName = 'simpleCssValidator';
var outputFile;

if (process.env.NODE_ENV === 'production') {
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

var config = {
 entry: path.resolve('src/index.js'),
 devtool: process.env.NODE_ENV === 'production' ? 'source-map' : false,
 output: {
   path: path.resolve('dist'),
   filename: outputFile,
   library: libraryName,
   libraryTarget: 'umd',
   umdNamedDefine: true

 },
 module: {
  rules: [
      { 
        test: /.jsx?$/,
        loader: "babel-loader"
      }
    ]
  },
 mode: 'production',
 plugins: [
  // new BundleAnalyzerPlugin()
 ],
 optimization: {
   minimize: process.env.NODE_ENV === 'production',
 }
}

module.exports = config;