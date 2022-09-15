const path = require('path')
module.exports = {
  transpileDependencies: ['vuetify'],
  publicPath: '',
  outputDir: './dist',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src/'),
      },
    },
  },
}
