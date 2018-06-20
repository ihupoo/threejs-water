const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const path = require("path");
const base = require('./webpack.base.conf')

module.exports = merge(base, {
    output: {
        filename: '[name].[chunkhash].js', //chunkhash:根据自身的内容计算而来
    },
    plugins: [
        new CleanWebpackPlugin('dist')
    ],
    mode: 'production'
})