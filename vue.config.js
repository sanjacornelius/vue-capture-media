const path = require('path');
const plugins = [];
module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    plugins,
    resolve: {
      modules: [
        path.resolve(__dirname, 'node_modules'),
        'node_modules',
      ],
      symlinks: false,
    },
    externals: process.env.NODE_ENV === 'production' ? [
     /^vue-capture-media\/.+$/,
      'vue-deepset',
      /^@fortawesome\/.+$/,
      'vue',
      'vuex',
      /^bootstrap\/.+$/,
      'i18next',
      '@panter/vue-i18next',
    ] : [],
  },
};
