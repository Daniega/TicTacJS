var config = require('./webpack.config.js');
var webpack = require('webpack');

config.plugins.push(
    new webpack.DefinePlugin({
        "process.env": {
            "NODE_ENV": JSON.stringify("production"),
            'API_HOST': JSON.stringify('https://tictacdani.herokuapp.com/')

        }
    })
);

config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    })
);

module.exports = config;
