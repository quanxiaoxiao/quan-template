'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultConfig = {
  default: {
    from: _path2.default.resolve(__dirname, '../', 'templates/component'),
    filter: function filter(_ref) {
      var filename = _ref.filename,
          _ref$flag = _ref.flag,
          flag = _ref$flag === undefined ? 'component' : _ref$flag;

      var flagList = flag.split('-');
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
    handle: function handle(_ref2) {
      var file = _ref2.file,
          name = _ref2.name,
          _ref2$flag = _ref2.flag,
          flag = _ref2$flag === undefined ? 'component' : _ref2$flag;

      var filename = file.base;
      var flagList = flag.split('-');
      var subIndex = flagList.indexOf('sub');
      if (/^__\w+__$/.test(file.name)) {
        filename = '' + name + file.ext;
      }
      return {
        from: _path2.default.resolve(this.from, file.base),
        to: _path2.default.join('src/components', subIndex !== -1 ? flagList[subIndex + 1] : name, filename)
      };
    }
  },

  container: {
    from: _path2.default.resolve(__dirname, '../', 'templates/container'),
    handle: function handle(a) {
      var filename = a.file.base;
      if (a.file.base === 'Component.js') {
        filename = a.name + '.js';
      }
      return {
        from: _path2.default.resolve(this.from, a.file.base),
        to: _path2.default.join('src/containers', a.name, filename)
      };
    }
  },

  reducer: {
    from: _path2.default.resolve(__dirname, '../', 'templates/redux/reducer.js'),
    handle: function handle(a) {
      var filename = a.file.base;
      if (a.file.base === 'reducer.js') {
        filename = a.name + '.js';
      }
      return {
        to: _path2.default.join('src/reducers', filename)
      };
    }
  },

  react: {
    from: _path2.default.resolve(__dirname, '../', 'templates/react'),
    filter: function filter(_ref3) {
      var filename = _ref3.filename;

      if (filename === 'node_modules') {
        return false;
      }
      return true;
    },
    handle: function handle(a) {
      return {
        from: _path2.default.resolve(this.from, a.file.base),
        to: _path2.default.join(a.name, a.file.dir, a.file.base)
      };
    },
    post: function post(name) {
      _shelljs2.default.cd(name);
      _shelljs2.default.sed('-i', /"name":\s+"([^"]+)"/, '"name": "' + name + '"', 'package.json');
      var dependencies = ['babel-polyfill', 'classnames', 'lodash', 'normalize.css', 'prop-types', 'react', 'react-dom', 'react-redux', 'redux', 'redux-promise', 'redux-thunk'];
      var devDependencies = ['autoprefixer', 'babel-core', 'babel-loader', 'babel-plugin-transform-runtime', 'babel-preset-es2015', 'babel-preset-react', 'babel-preset-react-hmre', 'babel-preset-stage-0', 'cross-env', 'css-loader', 'extract-text-webpack-plugin', 'html-webpack-plugin', 'node-sass', 'postcss-loader', 'redux-logger', 'rimraf', 'sass-loader', 'style-loader', 'url-loader', 'webpack', 'webpack-hot-middleware'];
      _shelljs2.default.exec('yarn add ' + dependencies.join(' '));
      _shelljs2.default.exec('yarn add --dev ' + devDependencies.join(' '));
    }
  },

  pro: {
    from: _path2.default.resolve(__dirname, '../', 'templates/pro'),
    filter: function filter(_ref4) {
      var filename = _ref4.filename;

      if (filename === 'node_modules') {
        return false;
      }
      return true;
    },
    handle: function handle(a) {
      return {
        from: _path2.default.resolve(this.from, a.file.base),
        to: _path2.default.join(a.name, a.file.dir, a.file.base)
      };
    },
    post: function post(name) {
      _shelljs2.default.cd(name);
      _shelljs2.default.sed('-i', /"name":\s+"([^"]+)"/, '"name": "' + name + '"', 'package.json');
      var devDependencies = ['babel-core', 'babel-preset-es2015', 'babel-preset-stage-0'];
      _shelljs2.default.exec('yarn add --dev ' + devDependencies.join(' '));
    }
  }
};

var customConfig = {};

try {
  var _config = require(_path2.default.resolve(process.cwd(), 'temp.config.js')); // eslint-disable-line
  customConfig = Object.keys(_config).reduce(function (acc, key) {
    var typeObj = _config[key];
    var parent = defaultConfig[typeObj.extend];
    if (parent) {
      typeObj.parent = parent;
    } else {
      parent = {};
    }
    return _extends({}, acc, _defineProperty({}, key, _extends({}, parent, typeObj)));
  }, {});
} catch (e) {
  console.log(e);
  // ignore
}

exports.default = _extends({}, defaultConfig, customConfig);