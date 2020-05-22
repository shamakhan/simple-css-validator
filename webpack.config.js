const path = require('path');


module.exports = {
 entry: path.resolve('src/index.js'),
 output: {
   path: path.resolve('dist'),
   filename: '[name].js',
 },
 module: {
  rules: [
      { 
        test: /.jsx?/,
        loader: "babel-loader"
      }
    ]
  },
 mode: 'production'
}
