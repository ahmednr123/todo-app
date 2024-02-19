const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const appConfig = {
    mode: 'development',
    entry: [`./src/index.ts`],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpeg|webp|woff|woff2|otf|eot|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100000
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: `./index.html`,
            favicon: `./favicon.ico`
        })
    ],
    devServer: {
        port: 3333,
        open: true,
        historyApiFallback: true,
        watchFiles: [
            path.resolve(__dirname, `./src`),
            '!**/dist/**'
        ]
    },
    output: {
        path: path.join(__dirname, `./dist`),
        filename: `bundle.js`
    }
};

module.exports = [ appConfig ];
