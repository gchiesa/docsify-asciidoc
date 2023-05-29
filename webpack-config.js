// const path = require('path');
//
// module.exports = {
//     mode: 'production',
//     entry: './src/index.js',
//     output: {
//         path: path.resolve('dist'),
//         filename: 'index.js',
//         libraryTarget: 'commonjs2',
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.js?$/,
//                 exclude: /(node_modules)/,
//                 use: 'babel-loader',
//             },
//         ],
//     },
//     resolve: {
//         extensions: ['.js'],
//     },
// };

const path = require("path")

module.exports = {
    entry: path.resolve(__dirname, "src/index.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js",
        library: "$",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
        ],
    },
    mode: "production",
}