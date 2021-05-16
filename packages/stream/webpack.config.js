const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: {
    stream: './src/stream/index.ts',
    apollo: './src/apollo/index.ts'
  },
  mode: 'development',
  target: 'node',
  devtool: 'eval-cheap-source-map',
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        include: [
          path.resolve(__dirname, './src/'),
          path.resolve(__dirname, '../shared/'),
          path.resolve(__dirname, '../proto/')
        ],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      }
    ]
  },
  watchOptions: { ignored: /build/ },
  resolve: {
    extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx']
  },
  output: {
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    path: path.resolve(__dirname, 'build')
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(__dirname, './tsconfig.json')
      }
    })
  ]
};
