const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // 解析vue必须的插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //分析插件
const copyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  target: 'web', // 不设置为web,热更新无效
  entry: '/src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'), // 输出位置
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[contenthash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/, // 添加解析 .vue文件loader
        use: [
          {
            loader: 'thread-loader',
            // 有同样配置的 loader 会共享一个 worker 池
          },
          'cache-loader',
          'vue-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            // 有同样配置的 loader 会共享一个 worker 池
          },
          'cache-loader',
          'babel-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              esModule: false, //关闭esmodule,启用commonjs
              output: 'img/',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false, // 关闭esmodule,启用commonjs
              generator: (content) => svgToMiniDataURI(content.toString()), // svg压缩
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new BundleAnalyzerPlugin({
      // 分析插件
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      generateStatsFile: true, // 是否生成stats.json文件
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      inject: 'body', // 生成的js脚本放在body底部
    }), // 生成模板
    // 获取动态链接
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: path.resolve(__dirname, '../static/dll', 'vue.mainfest.json'),
    }),
    // 拷贝资源到指定目录
    new copyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'), // 打包的静态资源目录地址
          to: 'static', // 打包到dist下面的static
        },
      ],
    }),
    new FriendlyErrorsWebpackPlugin(),
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.vue'],
    }),
  ],
};
