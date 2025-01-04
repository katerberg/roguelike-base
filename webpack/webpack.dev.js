const { merge } = require('webpack-merge')
const common = require('./webpack.common')

const dev = {
  mode: 'development',
  stats: 'errors-warnings',
  devtool: 'eval',
  devServer: {
    open: true,
    watchFiles: ['src/scripts**/*'],
  }

}

module.exports = merge(common, dev)
