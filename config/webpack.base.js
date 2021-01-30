const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // 解析vue必须的插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //分析插件
const copyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取css插件

const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production' ? true : false;

const config = {
  target: 'web', // 不设置为web,热更新无效
  entry: '/src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'), // 输出位置
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[contenthash:8].js',
  },
  cache: {
    type: 'filesystem',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@utils': path.resolve(__dirname, '../src/utils'),
    },
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
      {
        test: /\.css$/, // 添加解析 .css文件loader
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.scss$/, // 添加解析 .scss文件loader
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.less$/, // 添加解析 .less文件loader
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
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

if (process.env.npm_config_report) {
  config.plugins.push(new BundleAnalyzerPlugin()); //增加分析插件
}
if (isProduction) {
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
    }),
  ); //提取css; //增加分析插件
}

module.exports = config;
