const path = require('path');
const base = require('./webpack.base');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack5-plugin');
const smp = new SpeedMeasurePlugin();
const speed = process.env.SPEED;
console.log('---------------development---------------');

let config = {
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
config = merge(base, config);

// 分析打包速度插件
if (speed === 'open') {
  config = smp.wrap(config);
}

module.exports = config;
