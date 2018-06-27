const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js',
        // main: './src/main.js' //多页面设置，同时plugins需要加上一个新的HtmlWebpackPlugin
    },
    output: {
        filename: '[name].js', //打包后名称
        path: path.resolve(__dirname, '../dist'), //打包后路径
    },
    resolve: {
        mainFields: ['jsnext:main', 'browser', 'main'], //配合tree-shaking，优先使用es6模块化入口（import）
        extensions: ['.js', '.json', '.css'], //可省后缀
        alias: {
            '@': path.resolve(__dirname, '../src') //别名
        }
    },
    module: {
        noParse: /three\.js/, //这些库都是不依赖其它库的库 不需要解析他们可以加快编译速度
        rules: [{
                test: /\.js$/,
                use: 'babel-loader?cacheDirectory=true',
                // include: /src/,   //只转化src目录下js
                exclude: /node_modules/ //不转化node_modules目录下js
            },
            {
                test: /\.(html|htm)$/,
                use: 'html-withimg-loader' //html下的img路径
            },
            {
                test: /\.(eot|ttf|woff|svg|woff2)$/,
                use: 'file-loader'
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        outputPath: 'images/', //打包目录
                        name: '[name].[hash:7].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html', //目标文件
            template: './src/index.html', //模板
            chunks: ['manifest', 'vendor', 'utils', 'index'] //对应关系，index.js对应的是index.html
        }),
        new webpack.ProvidePlugin({ //自动加载模块，而不必到处 import 或 require
            'THREE': 'three'
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all', //'all'|'async'|'initial'(全部|按需加载|初始加载)的chunks
            // maxAsyncRequests: 1,                     // 最大异步请求数， 默认1
            // maxInitialRequests: 1,                   // 最大初始化请求书，默认1
            cacheGroups: {
                // 抽离第三方插件
                vendor: {
                    test: /node_modules/, // 指定是node_modules下的第三方包
                    chunks: 'all',
                    name: 'vendor', // 打包后的文件名，任意命名
                    priority: 10 // 设置优先级，防止和自定义公共代码提取时被覆盖，不进行打包
                },
                // 抽离自己写的公共代码，utils这个名字可以随意起
                utils: {
                    chunks: 'all',
                    name: 'utils',
                    minSize: 0, // 只要超出0字节就生成一个新包
                    minChunks: 2, //至少两个chucks用到
                    // maxAsyncRequests: 1,             // 最大异步请求数， 默认1
                    maxInitialRequests: 5, // 最大初始化请求书，默认1
                }
            }
        },
        //提取webpack运行时的代码
        runtimeChunk: {
            name: 'manifest'
        }
    }

}