const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const path = require("path");
const base = require('./webpack.base.conf')

module.exports = merge(base, {
    plugins: [
        new CleanWebpackPlugin('dist')
    ],
    mode: 'production'
})