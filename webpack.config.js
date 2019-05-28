const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'featurematrix.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'FeatureMatrix',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'awesome-typescript-loader'
            },
        ]
    },
    mode: 'production',
    resolve: {
        extensions: ['.ts']
    }
};