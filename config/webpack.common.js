'use strict';

var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./webpack-helpers');
var ExtractTextVendorStyle = new ExtractTextPlugin(path.join('style', 'vendor.css'), { allChunks: true });

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },

  resolve: {
    extensions: ['', '.ts', '.js']
  },

  output: {
    path: helpers.root('dist'),
    publicPath: 'http://localhost:8080/',
    filename: '[name].bundle.js',
  },
  postcss: {
    postcss: [autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'ie >= 10', 'Firefox ESR'] })]
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: 'raw!postcss!sass',
      },
      {
        test: /\.scss$/,
        loader: ExtractTextVendorStyle.extract('css!postcss!sass'),
        include: [path.resolve('src/assets/vendor')]
      },
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
        loader: 'file-loader?name=fonts/[name].[hash].[ext]?'
      },
      {
        test: /\.html$/,
        loader: 'html'
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),
    ExtractTextVendorStyle,
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunksSortMode: 'dependency',
      hash: true,
      cache: true,
      showErrors: false
    })
  ]
};