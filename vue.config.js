const path = require('path');

const threeTrackballControlsPath = 'node_modules/three/examples/jsm/controls/TrackballControls.js';
const threeOrbitControlsPath = 'node_modules/three/examples/jsm/controls/OrbitControls.js';

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
  configureWebpack: {
    resolve: {
      alias: {
        'three/trackballControls': path.resolve(__dirname, threeTrackballControlsPath),
        'three/orbitControls': path.resolve(__dirname, threeOrbitControlsPath),
      },
      extensions: ['js'],
    },
  },
};
