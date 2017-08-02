'use strict';

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = _yargs2.default.options({
  type: {
    alias: 't',
    description: 'Set template type',
    default: 'component'
  }
}).version(_package2.default.version).alias('version', 'v').argv;

console.log(argv.type);