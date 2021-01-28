const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    // 第三方库
    vue: ["vue", "vue-router"],
  },
  output: {
    // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，
    filename: "[name].dll.js",
    path: path.resolve(__dirname, "../static/dll"),
    // library必须和后面dllplugin中的name一致 后面会说明
    library: "[name]_library",
  },
  plugins: [
    new CleanWebpackPlugin(),
    // 接入 DllPlugin
    new webpack.DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 mainfest.json 文件 中 name 字段的值
      name: "[name]_library",
      // 描述动态链接库的 mainfest.json 文件输出时的文件名称
      path: path.join(__dirname, "../static/dll", "[name].mainfest.json"),
      context: __dirname,
    }),
  ],
};
