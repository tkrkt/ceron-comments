const webpack = require("webpack");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const conf = {
  prodMode: process.env.NODE_ENV === "production"
};

module.exports = [
  {
    mode: conf.prodMode ? "production" : "development",
    cache: true,
    entry: {
      background: "./src/background/index.ts"
    },
    output: {
      path: __dirname + "/dist",
      filename: "[name].bundle.js"
    },
    resolve: {
      extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.css$/,
          loaders: ["style-loader", "css-loader"]
        },
        {
          test: /\.(ttf|eot|svg|woff|woff2)(\?.+)?$/,
          loader: "file-loader",
          options: {
            name: "[hash:12].[ext]",
            publicPath: path => "dist/" + path
          }
        },
        {
          test: /\.tsx?$/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          },
          exclude: /node_modules/
        }
      ]
    },

    plugins: [
      new CaseSensitivePathsPlugin(),
      new ForkTsCheckerWebpackPlugin(),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      })
    ]
  }
];
