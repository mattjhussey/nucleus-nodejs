'use strict';

module.exports = {
  entry: './src/app.js',
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style!css'}
    ]
  },
  output: {
    path: __dirname + '/app',
    filename: 'bundle.js'
  }
};
