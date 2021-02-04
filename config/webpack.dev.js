const path = require('path');
const base = require('./webpack.base');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
console.log('---------------development---------------');

const config = {
  mode: 'development',
  devtool: 'eval-source-map',
  stats: 'errors-only',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    hot: true,
    compress: true,
  },
  plugins: [
    // 设置全局变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.env.NODE_ENV
        ? JSON.stringify(process.env.NODE_ENV)
        : JSON.stringify('development'),
    }),
    new webpack.HotModuleReplacementPlugin(), //热更新替换插件
  ],
};
config.plugins.push(
  new FriendlyErrorsWebpackPlugin({
    compilationSuccessInfo: {
      messages: [`Your application is running here: http://localhost:${config.devServer.port}`],
    },
  }),
);
module.exports = merge(base, config);
