import path from 'path';
import shelljs from 'shelljs';
import os from 'os';

const defaultConfig = {
  default: {
    from: path.resolve(__dirname, '../', 'templates/component'),
    filter({ filename, flag = 'component' }) {
      const flagList = flag.split('-');
      if (filename === '__Component__.js' && flagList.includes('clazz')) {
        return false;
      }
      if (filename === '__Clazz__.js' && !flagList.includes('clazz')) {
        return false;
      }
      if (filename === 'index.js' && flagList.includes('sub')) {
        return false;
      }
      return true;
    },
    handle({ file, name, flag = 'component' }) {
      let filename = file.base;
      const flagList = flag.split('-');
      const subIndex = flagList.indexOf('sub');
      if (/^__\w+__$/.test(file.name)) {
        filename = `${name}${file.ext}`;
      }
      return {
        from: path.resolve(this.from, file.base),
        to: path.join(
          'src/components',
          subIndex !== -1 ? flagList[subIndex + 1] : name,
          filename,
        ),
      };
    },
  },

  container: {
    from: path.resolve(__dirname, '../', 'templates/container'),
    handle(a) {
      let filename = a.file.base;
      if (a.file.base === 'Component.js') {
        filename = `${a.name}.js`;
      }
      return {
        from: path.resolve(this.from, a.file.base),
        to: path.join('src/containers', a.name, filename),
      };
    },
  },

  reducer: {
    from: path.resolve(__dirname, '../', 'templates/redux/reducer.js'),
    handle(a) {
      let filename = a.file.base;
      if (a.file.base === 'reducer.js') {
        filename = `${a.name}.js`;
      }
      return {
        to: path.join('src/reducers', filename),
      };
    },
  },

  react: {
    from: path.resolve(__dirname, '../', 'templates/react'),
    filter({ filename }) {
      if (filename === 'node_modules') {
        return false;
      }
      return true;
    },
    handle(a) {
      return {
        from: path.resolve(this.from, a.file.base),
        to: path.join(a.name, a.file.dir, a.file.base),
      };
    },
    post(name) {
      shelljs.cd(name);
      shelljs.sed('-i', /"name":\s+"([^"]+)"/, `"name": "${name}"`, 'package.json');
      const dependencies = [
        'babel-polyfill',
        'classnames',
        'lodash',
        'normalize.css',
        'prop-types',
        'react',
        'react-dom',
        'react-redux',
        'redux',
        'redux-promise',
        'redux-thunk',
      ];
      const devDependencies = [
        'autoprefixer',
        'babel-core',
        'babel-loader',
        'babel-plugin-transform-runtime',
        'babel-preset-env',
        'babel-preset-react',
        'babel-preset-react-hmre',
        'babel-preset-stage-0',
        'cross-env',
        'css-loader',
        'extract-text-webpack-plugin',
        'html-webpack-plugin',
        'lodash-webpack-plugin',
        'node-sass',
        'postcss-loader',
        'redux-logger',
        'rimraf',
        'sass-loader',
        'style-loader',
        'url-loader',
        'webpack',
        'webpack-hot-middleware',
      ];
      shelljs.exec(`npm install ${dependencies.join(' ')}`);
      shelljs.exec(`npm install --save-dev ${devDependencies.join(' ')}`);
    },
  },

  pro: {
    from: path.resolve(__dirname, '../', 'templates/pro'),
    filter({ filename }) {
      if (filename === 'node_modules' || filename === 'server.js') {
        return false;
      }
      return true;
    },
    handle(a) {
      return {
        from: path.resolve(this.from, a.file.base),
        to: path.join(a.name, a.file.dir, a.file.base),
      };
    },
    post(name) {
      shelljs.cd(name);
      shelljs.sed('-i', /"name":\s+"([^"]+)"/, `"name": "${name}"`, 'package.json');
      const devDependencies = ['babel-core', 'babel-preset-env', 'babel-preset-stage-0'];
      shelljs.exec(`npm install --save-dev ${devDependencies.join(' ')}`);
    },
  },

  dir: {
    from: 'some dir path',
    handle(a) {
      return {
        from: path.resolve(this.from, a.file.base),
        to: path.join(a.name, a.file.dir, a.file.base),
      };
    },
  },
};

function combineConfig(a, b) {
  return Object.keys(a)
    .reduce((acc, key) => {
      const obj = a[key];
      obj.parent = b[obj.extend] || {};
      return {
        ...acc,
        [key]: {
          ...obj.parent,
          ...obj,
        },
      };
    }, {});
}

let selfConfig = {};
let customConfig = {};

try {
  const _config = require(path.resolve(os.homedir(), 'temp.config.js')); // eslint-disable-line
  customConfig = combineConfig(_config, defaultConfig);
} catch (e) {
  // ignore
}

try {
  const _config = require(path.resolve(process.cwd(), 'temp.config.js')); // eslint-disable-line
  selfConfig = combineConfig(_config, defaultConfig);
} catch (e) {
  // ignore
}

export default {
  ...defaultConfig,
  ...customConfig,
  ...selfConfig,
};
