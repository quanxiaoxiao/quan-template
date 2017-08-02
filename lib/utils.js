'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAbsoultePath = exports.convertContent = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var convertContent = exports.convertContent = function convertContent(content, name) {
  return content.replace(/{{\s*name\s*}}/g, name);
};

var getAbsoultePath = exports.getAbsoultePath = function getAbsoultePath(src) {
  if (_path2.default.isAbsolute(src)) {
    return src;
  }
  return _path2.default.resolve(process.cwd(), src);
};