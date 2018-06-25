const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const path = require("path");
const base = require('./webpack.base.conf');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(base, {
    output: {
        filename: '[name].[chunkhash].js', //chunkhash:根据自身的内容计算而来
    },
    plugins: [
        new CleanWebpackPlugin('dist', {
            root: path.resolve(__dirname, '../'),
            verbose: true
        }),
        // new BundleAnalyzerPlugin()
    ],
    mode: 'production'
})