var path = require("path");
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
        ]
    }
}