'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = console.log;

function createTemplate(_ref) {
  var to = _ref.to,
      from = _ref.from,
      name = _ref.name,
      convert = _ref.convert;

  var dir = _path2.default.dirname(to);
  if (!_shelljs2.default.test('-d', dir)) {
    _shelljs2.default.mkdir('-p', dir);
  }
  try {
    _fs2.default.accessSync(to);
    log('file: ' + _chalk2.default.red(to) + ' already exist');
  } catch (e) {
    var content = _fs2.default.readFileSync(from, 'utf-8');
    _fs2.default.writeFileSync(to, convert(content, name), 'utf8');
    log('file: ' + _chalk2.default.green(to) + ' created');
  }
}

exports.default = createTemplate;