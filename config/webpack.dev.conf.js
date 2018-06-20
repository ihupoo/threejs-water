const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require("path");
const base = require('./webpack.base.conf');
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

module.exports = merge(base, {
    plugins: [
        new webpack.HotModuleReplacementPlugin(), //热更新，还需在index.js里配置
        new FriendlyErrorsWebpackPlugin() //优化 webpack 输出信息
    ],
    devtool: '#cheap-module-eval-source-map',
    devServer: {
        contentBase: './dist', //服务路径，存在于缓存中
        host: 'localhost', // 默认是localhost
        port: 9080, // 端口
        open: true, // 自动打开浏览器
        hot: true, // 开启热更新
        progress: true, // 显示 webpack 构建进度
        // proxy: xxx //接口代理配置
        quiet: true //和friendly-errors-webpack-plugin配合
    },
    mode: 'development'

})