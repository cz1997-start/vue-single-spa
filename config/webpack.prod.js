const path = require("path");
const base = require("./webpack.base");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 提取css插件
const CompressionPlugin = require("compression-webpack-plugin"); // 开启gizp压缩插件
const TerserPlugin = require("terser-webpack-plugin"); //压缩js
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); //压缩css
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

console.log("---------------production---------------");

module.exports = merge(base, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/, // 添加解析 .css文件loader
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.scss$/, // 添加解析 .scss文件loader
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.less$/, // 添加解析 .less文件loader
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "less-loader"],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 0,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        vendor: {
          // 提取第三方包,防止和业务代码混淆
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
        },
      },
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
      "process.env.NODE_ENV": process.env.NODE_ENV
        ? JSON.stringify(process.env.NODE_ENV)
        : JSON.stringify("production"),
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "css/[name].[contenthash:8].css",
    }), //提取css
    new CompressionPlugin({
      threshold: 8192, // 仅处理大于8k的文件
    }), //开启gzip压缩
    new CleanWebpackPlugin(), // 删除上次构建的文件
  ],
});
