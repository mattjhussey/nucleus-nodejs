'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: ['./src/client/index.js']
  },
  module: {
    unknownContextCritical: false,
    loaders: [
      {test: /\.css$/, loader: 'style!css'},
      {test: /\.geojson$/, loader: 'json'},
      {test: /\.html$/, loader: 'html'},
      {test: /\.less$/, loader: 'style!css!less'},
      {
        test: /node_modules[\\\/]html5-boilerplate[\\\/]dist[\\\/]js[\\\/]vendor[\\\/]modernizr-2\.8\.3\.min\.js$/,
        loader: 'imports?this=>window!exports?window.Modernizr'
      },
      {test: /\.png$/, loader: 'img!file'},
      {test: /\.scss$/, loader: 'style!css!sass'},
      {test: /\.(eot|svg|ttf|woff(2)?)$/, loader: 'file'}
    ]
  },
  output: {
    path: path.join(__dirname, 'public/'),
    filename: 'bundle.min.js',
    publicPath: '/',
    sourcePrefix: ''
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true)
  ],
  resolve: {
    root: path.resolve(__dirname),
    alias: {
      'mjhtest-filter-panel': 'src/client/filter-panel',
      'mjhtest-graphs': 'src/client/graphs',
      'mjhtest-info-panel': 'src/client/info-panel',
      'mjhtest-maps': 'src/client/maps',
      'mjhtest-view-map': 'src/client/view-map'
    }
  }
};
