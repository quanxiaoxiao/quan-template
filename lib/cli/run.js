'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config2 = require('../config');

var _config3 = _interopRequireDefault(_config2);

var _generator = require('../generator');

var _generator2 = _interopRequireDefault(_generator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (argv) {
  var name = _lodash2.default.first(argv._);
  if (_lodash2.default.isUndefined(name)) {
    throw new Error('lack name');
  }
  var config = _config3.default[argv.type];
  var flag = argv.flag;
  if (!_lodash2.default.isPlainObject(config)) {
    throw new TypeError();
  }

  (0, _generator2.default)(name, flag, config);
  if (typeof config.post === 'function') {
    config.post(name, flag);
  }
};