const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 拆分css,会把css文件放到dist目录下的css/style.css,以link的方式引入css
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
let styleCss = new ExtractTextWebpackPlugin({
    filename: 'css/style.css',
    allChunks: true
});
let styleScss = new ExtractTextWebpackPlugin('css/style2.css');

module.exports = {
    entry: {
        index: './src/index.js',
        // main: './main.js'
    },
    output: {
        filename: '[name].js', //打包后名称
        path: path.resolve(__dirname, '../dist'), //打包后路径
    },
    resolve: {
        mainFields: ['jsnext:main', 'browser', 'main'], //tree-shaking
        extensions: ['.js', '.json', '.css'], //可省后缀
        alias: {
            '@': path.resolve(__dirname, '../src') //别名
        }
    },
    module: {
        rules: [{
                test: /\.js$/,
                use: 'babel-loader',
                // include: /src/, //只转化src目录下js
                exclude: /node_modules/ //不转化node_modules目录下js
            },
            {
                test: /\.css$/,
                use: styleCss.extract({
                    fallback: "style-loader", // 样式没有被抽取时 style-loader 
                    use: ['css-loader', 'postcss-loader'], // 将css用link的方式引入就不再需要style-loader了
                    publicPath: '../' //与url-loader里的outputPath对应，这样可以根据相对路径引用图片资源
                })
            },
            {
                test: /\.scss$/,
                use: styleScss.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'postcss-loader', 'sass-loader'],
                    publicPath: '../'
                })
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
        styleCss,
        styleScss,
        new HtmlWebpackPlugin({
            filename: 'index.html', //目标文件
            template: './src/index.html', //模板
            chunks: ['manifest', 'vendor', 'utils', 'index'] // 对应关系，index.js对应的是index.html
        }),
        new webpack.ProvidePlugin({
            'THREE': 'three'
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
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
                    minChunks: 2 //至少两个chucks用到
                }
            }
        },
        runtimeChunk: { //提取webpack运行时的代码
            name: 'manifest'
        }
    }

}