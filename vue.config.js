module.exports = {
  publicPath: "/registration",
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    },
    "style-resources-loader": {
      preProcessor: "stylus",
      patterns: []
    }
  },
  transpileDependencies: ["vuetify"]
};
