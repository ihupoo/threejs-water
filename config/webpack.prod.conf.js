const webpack = require('webpack');
const base = require('./webpack.base.conf');
const merge = require('webpack-merge');
const path = require("path");
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const Happypack = require('happypack');
const os = require('os');
const happyThreadPool = Happypack.ThreadPool({ size: os.cpus().length });

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(base, {
    output: {
        filename: '[name].[chunkhash].js', //chunkhash:根据自身的内容计算而来
    },
    module: {
        rules: [{
            test: /\.(css|scss|sass)$/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath: '../'
                }
            }, {
                loader: 'happypack/loader?id=css'
            }]
        }]
    },
    plugins: [

        new CleanWebpackPlugin('dist', {
            root: path.resolve(__dirname, '../'),
            verbose: true
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[name].[contenthash].css',
        }),
        new Happypack({
            id: "css",
            loaders: [{
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        minimize: true
                    }
                },
                'postcss-loader',
                'sass-loader'
            ],
            threadPool: happyThreadPool,
            verbose: true
        }),
        new webpack.HashedModuleIdsPlugin(), //固化module id

        // new BundleAnalyzerPlugin() // 可视化定位体积大的模块, 使用默认配置，启动127.0.0.1:8888
    ],
    mode: 'production'
})