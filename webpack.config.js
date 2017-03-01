const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractSass = new ExtractTextPlugin(
    {
        filename: "bundle.css",
        allChunks: true
    });

module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: 'bundle.js',
        publicPath: 'http://localhost:3030'
    },
    resolve: {
        extensions: ['.js']
    },
    devServer: {
        host: 'localhost',
        port: 3030,
        inline: true,
        contentBase: "./build"
    },
    module: {
        loaders: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
            },
            {
                test: /(\.js)$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
                query: {
                    presets: ['es2015']
                }
            }
        ],
        rules: [{
            test: /\.scss$/,
            loader: extractSass.extract({
                loader: [{
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }]
            })
        }]
    },
    plugins: [
        extractSass
    ]
}