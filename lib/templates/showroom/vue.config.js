module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.csv$/,
          loader: 'csv-loader',
          options: {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true
          }
        }
      ]
    }
  },
  lintOnSave: false,
  pluginOptions: {
    lintStyleOnBuild: false,
    stylelint: {}
  },
  publicPath:
    process.env.NODE_ENV === 'production' &&
    process.env.GITHUB_ACTION_REPOSITORY
      ? '/' + process.env.GITHUB_ACTION_REPOSITORY.split('/')[1] + '/'
      : '/'
};
