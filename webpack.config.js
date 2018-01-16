const path = require("path")
const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
const extractCSS = new ExtractTextPlugin(
  "assets/stylesheets/[name].bundle.dev.css"
)

let plugins = [
  extractCSS,
  new HtmlWebpackPlugin({
    template: "./index.html",
    filename: "index.html",
    inject: true
  })
]

if (process.env.NODE_ENV === "production") plugins.push(new UglifyJSPlugin())

module.exports = {
  context: path.resolve(__dirname, "src/client"),
  entry: ["./index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/dist",
    filename: "assets/scripts/[name].bundle.js"
  },
  module: {
    rules: [
      // Javascript files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      // HTML files or templates
      {
        test: /\.html$/,
        loader: "raw-loader"
      },
      // CSS files or stylesheets
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
          ]
        })
      },
      // Images
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/images/[name].[ext]"
            }
          }
        ]
      },
      // Music
      {
        test: /\.(mp3|ogg|aac|flac)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/sounds/[name].[ext]"
            }
          }
        ]
      },
      // Videos
      {
        test: /\.(mp4|avi|mkv)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/videos/[name].[ext]"
            }
          }
        ]
      },
    ]
  },
  plugins,
  resolve: {
    extensions: [".js"]
  },
  devtool: process.env.NODE_ENV === "dev" ? "eval-source-map" : "",
}
