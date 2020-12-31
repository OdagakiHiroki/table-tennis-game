module.exports = {
  css: {
    loaderOptions: {
      css: {
        url: false,
      },
      sass: {
        prependData: '@import "~@/assets/css/html5reset-1.6.1.css";',
      },
    },
  },
};
