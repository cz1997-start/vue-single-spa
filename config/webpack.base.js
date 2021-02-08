const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');
const { VueLoaderPlugin } = require('vue-loader'); // 解析vue必须的插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //分析插件
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取css插件

const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production' ? true : false;

const config = {
  target: 'web', // 不设置为web,热更新无效
  entry: '/src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'), // 输出位置
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
  },
  cache: {
    type: 'filesystem',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      vue$: 'vue/dist/vue.runtime.esm-bundler.js',
    },
  },
  module: {
    noParse: /^(vue|vue-router|vuex)$/,
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
        include: path.resolve(__dirname, '../src'), // 只处理src目录下的文件
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
        include: path.resolve(__dirname, '../src'), // 只处理src目录下的文件
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
        include: path.resolve(__dirname, '../src'), // 只处理src目录下的文件
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          /* config.module.rule('fonts').use('url-loader') */
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]',
                },
              },
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
        include: path.resolve(__dirname, '../src'), // 只处理src目录下的文件
      },
      {
        test: /\.scss$/, // 添加解析 .scss文件loader
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
        include: path.resolve(__dirname, '../src'), // 只处理src目录下的文件
      },
      {
        test: /\.less$/, // 添加解析 .less文件loader
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
        include: path.resolve(__dirname, '../src'), // 只处理src目录下的文件
      },
      {
        test: /\.js?$/,
        use: [
          {
            loader: 'thread-loader',
            // 有同样配置的 loader 会共享一个 worker 池
          },
          'babel-loader',
        ],
        include: path.resolve(__dirname, '../src'), // 只处理src目录下的文件
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      // inject: 'body', // 生成的js脚本放在body底部
    }), // 生成模板
    new ESLintPlugin({
      context: path.resolve(__dirname, '../src'),
      extensions: ['.js', '.jsx', '.vue'],
      threads: true,
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
