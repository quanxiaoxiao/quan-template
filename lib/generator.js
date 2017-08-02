'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = generator;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _utils = require('./utils');

var _createFile = require('./createFile');

var _createFile2 = _interopRequireDefault(_createFile);

var _getFileList = require('./getFileList');

var _getFileList2 = _interopRequireDefault(_getFileList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generator(name, flag, config) {
  var list = (0, _getFileList2.default)(config.from).filter(function (filename) {
    return config.filter ? config.filter({ filename: filename, name: name, flag: flag }) : true;
  }).map(function (a) {
    return _extends({
      name: name,
      convert: _utils.convertContent,
      from: config.from
    }, config.handle({
      name: name,
      flag: flag,
      file: _extends({}, _path2.default.parse(a), {
        dir: config.dir || ''
      })
    }));
  }).map(function (a) {
    return _extends({}, a, {
      to: (0, _utils.getAbsoultePath)(a.to)
    });
  });

  for (var i = 0; i < list.length; i++) {
    var obj = list[i];
    if (_shelljs2.default.test('-d', obj.from)) {
      generator(name, flag, _extends({}, config, {
        from: obj.from,
        dir: _path2.default.join(config.dir || '', _path2.default.basename(obj.from))
      }));
    } else {
      (0, _createFile2.default)(obj);
    }
  }
}