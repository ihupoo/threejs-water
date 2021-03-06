const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require("path");
const base = require('./webpack.base.conf');
// const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

module.exports = merge(base, {
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), //热更新，还需在index.js里配置
        // new FriendlyErrorsWebpackPlugin() //优化 webpack 输出信息

    ],

    devtool: '#source-map', //方便断点调试
    // devtool: '#cheap-module-eval-source-map',//构建速度快，采用eval执行

    devServer: {
        contentBase: path.resolve(__dirname, '../dist'), //服务路径，存在于缓存中
        host: 'localhost', // 默认是localhost
        port: 8080, // 端口
        open: true, // 自动打开浏览器
        hot: true, // 开启热更新,只监听js文件，所以css假如被抽取后，就监听不到了
        // inline: true,//inline模式开启服务器(默认开启)
        // proxy: xxx //接口代理配置
        // quiet: true //和friendly-errors-webpack-plugin配合,但webpack自身的错误或警告在控制台不可见。
        clientLogLevel: "none", //阻止打印那种搞乱七八糟的控制台信息
    },
    mode: 'development'

})