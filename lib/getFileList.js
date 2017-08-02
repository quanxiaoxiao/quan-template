'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFileList;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFileList(from) {
  if (typeof from !== 'string' || Array.isArray(from)) {
    throw new Error();
  }
  if (Array.isArray(from)) {
    return from.map(_utils.getAbsoultePath);
  }
  from = (0, _utils.getAbsoultePath)(from); // eslint-disable-line
  if (_shelljs2.default.test('-d', from)) {
    return _fs2.default.readdirSync(from);
  }
  return [from];
}