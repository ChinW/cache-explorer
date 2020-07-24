const path = require("path");
const NodemonPlugin = require('nodemon-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  entry: {
    ws: "./src/index.ts",
  },
  mode: "development",
  target: "node",
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        include: [
          path.resolve(__dirname, "./src/"),
          path.resolve(__dirname, "./src/")
        ],
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  output: {
    filename: "[name].js",
    sourceMapFilename: "[file].map",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(__dirname, "./tsconfig.json"),
      },
    }),
    new NodemonPlugin({
      "execMap": {
        "js": "node --harmony"
      },
      // args: ['| ./node_modules/.bin/bunyan']
    }), 
  ],
};
