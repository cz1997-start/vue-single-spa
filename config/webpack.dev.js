const path = require("path");
const base = require("./webpack.base");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
console.log("---------------development---------------");
module.exports = merge(base, {
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.css$/, // 添加解析 .css文件loader
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              // 开启 CSS Modules
              modules: true,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.scss$/, // 添加解析 .scss文件loader
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.less$/, // 添加解析 .less文件loader
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    hot: true,
    compress: true,
  },
  plugins: [
    // 设置全局变量
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": process.env.NODE_ENV
        ? JSON.stringify(process.env.NODE_ENV)
        : JSON.stringify("development"),
    }),
    new webpack.HotModuleReplacementPlugin(), //热更新替换插件
  ],
});
