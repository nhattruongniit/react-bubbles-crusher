const path = require('path');

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "public/"),
        filename: "./bundle.js",
        devtoolModuleFilenameTemplate: "./public/[resource]"

    },
    devtool: 'cheap-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, './public'),
        compress: true,
        //host: '192.168.35.23',
        port: 9000
    },
}