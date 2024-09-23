const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: `development`,
    entry: {
        index: './src/index.js',
        combatLog: './src/combatLog.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        assetModuleFilename: 'images/[name][ext][query]'
    },
    devtool: "eval-source-map",
    devServer: {
        watchFiles: ["./src/index.html"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            title: 'Output Management',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.mp3$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'audio/[name][ext][query]'
                }
            },
        ],
    },
};