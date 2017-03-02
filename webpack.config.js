/*node warnings false*/
process.noDeprecation = true

/*require node_modules*/
const path                           = require("path");
const ExtractTextPlugin              = require("extract-text-webpack-plugin");
const webpack                        = require("webpack");
const package                        = require('./package.json');
const HtmlWebpackPlugin              = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CleanWebpackPlugin             = require('clean-webpack-plugin');

/*check if have dependencies*/
let checkDependencies = () => !!(package && package.dependencies);

/*retrive entry obj if dependencies exist or not*/
let retriveEntry = () => {
    let entry = {};
    entry = {
        app: [
            path.resolve(__dirname, 'src') + '/index.js',
            //needed to resolve issue with ExtractTextPlugin
            path.resolve(__dirname, 'src') + '/style.scss'
        ]
    };
    if (checkDependencies()) entry.vendor = Object.keys(package.dependencies);
    return entry;
}
/*retrive plugins array if dependencies exist or not*/
let retrivePlugins = () => {
    let plugins = [];
    const generateCleanUp = new CleanWebpackPlugin(['build'], { root: path.resolve(__dirname) });
    const extractSass = new ExtractTextPlugin({ filename: "bundle.css", allChunks: true });
    const generateHTML = new HtmlWebpackPlugin();
    const generateVendors = new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' });
    const generateCSS = new HtmlWebpackIncludeAssetsPlugin({ assets: ['bundle.css'], append: false });
    plugins = [generateCleanUp, extractSass, generateHTML, generateCSS];
    if (checkDependencies()) plugins.push(generateVendors);
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
        extensions: ['.js','.sass','.css']
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
                    compact: true
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

