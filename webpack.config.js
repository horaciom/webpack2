process.noDeprecation = true

const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const package = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const extractSass = new ExtractTextPlugin({ filename: "bundle.css", allChunks: true });

const CleanWebpackPlugin = require('clean-webpack-plugin');

let checkDependencies = () => !!(package && package.dependencies);

let retriveEntry = () => {
    const entry = {
        app: [
            path.resolve(__dirname, 'src') + '/index.js',
            //needed to resolve issue with ExtractTextPlugin
            path.resolve(__dirname, 'src') + '/style.scss'
        ]
    };
    if (checkDependencies()) entry.vendor = Object.keys(package.dependencies);
    return entry;
}

let retrivePlugins = () => {
    const plugins = [extractSass];
    const generateVendors = new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' });
    const generateHTML = new HtmlWebpackPlugin();
    const generateCSS = new HtmlWebpackIncludeAssetsPlugin({ assets: ['bundle.css'], append: false });
    if (checkDependencies()) plugins.push(generateVendors);
    plugins.push(new CleanWebpackPlugin(['dist', 'build'], {
        root: path.resolve(__dirname),
        verbose: true,
        dry: false,
        exclude: ['shared.js']
    }));
    plugins.push(generateHTML);
    plugins.push(generateCSS);
    plugins.push(generateCSS);
    return plugins;
}

module.exports = {
    entry: retriveEntry(),
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
                    presets: ['es2015'],
                    compact: false
                }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }]
                })
            }
        ]
    },
    plugins: retrivePlugins()
}

