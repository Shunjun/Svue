const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  //...
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.ts'),
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        loader: 'babel-loader',
        // 开启缓存
        options: { cacheDirectory: true },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts',]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'disc'),
    index: 'index.html',
    compress: true,
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Vue.js',
      template: './src/public/index.html'
    })
  ],
  devtool: 'eval'
}
