const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const paths = {
  DIST: path.resolve(__dirname, 'dist'),
  JS: path.resolve(__dirname, 'js'),
  ROOT: path.resolve(__dirname)
}

module.exports = {
  entry: path.join(paths.JS, 'entry.js'),
  output: {
    path: paths.DIST,
    filename: 'app.bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(paths.ROOT, 'index.html')
    })
  ]
}
