const path = require('path');
const webpack = require('webpack');
const CURRENT_WORKING_DIR = process.cwd();

const config = {
    name: "browser",
    mode: "development",
    devtool: "eval-source-map",
    entry: [
        "webpack-hot-middleware/client?reload=true",
        path.join(CURRENT_WORKING_DIR, "/client/main.js")
    ],
    output: {
        path: path.join(CURRENT_WORKING_DIR, "/dist/"),
        filename: "bundle.js",
        publicPath: "/dist/"
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(jpeg|jpg|eot|gif|ttf|svg|png)(\?[\s\S]+)?$/,
                use: ['file-loader']
            }
        ]
    },
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    }
};

module.exports = config;