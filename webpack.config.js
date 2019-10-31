const path = require('path');

const MODE = process.env.WEBPACK_ENV;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ENTRY_JS = path.resolve(__dirname, "src", "asserts", "js", "main.js");
const ENTRY_SCSS = path.resolve(__dirname, "src", "asserts", "scss", "main.scss");
const OUTPUT_DIR = path.join(__dirname, "src", "static");

const config = {
  mode: MODE,
  entry: ["@babel/polyfill", ENTRY_JS, ENTRY_SCSS],
  output: {
    path : OUTPUT_DIR,
    filename : "[name].js"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
      }]
    }, {
      test:/\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader",
        "sass-loader"
      ]
    }]
  },
};



module.exports = config;