const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require("path");
const base = require('./webpack.base.conf')

module.exports = merge(base, {
    plugins: [
        new webpack.HotModuleReplacementPlugin() //热更新，还需在index.js里配置
    ],
    devServer: {
        contentBase: './dist',
        host: 'localhost', // 默认是localhost
        port: 9080, // 端口
        open: true, // 自动打开浏览器
        hot: true // 开启热更新
    },
    mode: 'development'

})