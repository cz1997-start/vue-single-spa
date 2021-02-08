const path = require('path');
const base = require('./webpack.base');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin'); // 开启gizp压缩插件
const TerserPlugin = require('terser-webpack-plugin'); //压缩js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); //压缩css
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack5-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const gizp = process.env.GZIP;

console.log('---------------production---------------');

let config = merge(base, {
  mode: 'production',
  stats: {
    preset: 'errors-only',
    chunks: true,
    assets: true,
  },
  optimization: {
    splitChunks: {
      minSize: 0,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        vendor: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial',
        },
        common: {
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    // 设置全局变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.env.NODE_ENV
        ? JSON.stringify(process.env.NODE_ENV)
        : JSON.stringify('production'),
    }),

    new CleanWebpackPlugin(), // 删除上次构建的文件
    new FriendlyErrorsWebpackPlugin(),
    new copyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'), // 打包的静态资源目录地址
          to: path.resolve(__dirname, '../dist'), // 打包到dist下面
          toType: 'dir',
        },
      ],
    }),
  ],
});

// 开启gzip
if (gizp === 'open') {
  config.plugins.push(
    new CompressionPlugin({
      threshold: 8192, // 仅处理大于8k的文件
    }), //开启gzip压缩
  );
}

module.exports = config;
